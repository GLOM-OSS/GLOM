import { GlomMailerService, resetPasswordMessages } from '@glom/nest-mailer';
import { GlomPrismaService } from '@glom/prisma';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { excludeKeys } from '@squoolr/utils';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Profile } from 'passport';
import { SignUpDto, UserEntity } from './glom-auth.dto';
import { RoleCheckOptions, User } from './glom-auth.type';

@Injectable()
export class GlomAuthService {
  constructor(
    private prismaService: GlomPrismaService,
    private mailerService: GlomMailerService
  ) {}

  async validateUser(
    request: Request,
    email: string,
    password: string
  ): Promise<User> {
    const person = await this.prismaService.person.findUnique({
      where: { email },
      include: { logins: true },
    });
    if (person) {
      const { logins, ...personData } = person;
      const origin = new URL(request.headers.origin).host;
      const user = logins.find((_) => bcrypt.compareSync(password, _.password));
      if (user && (await this.isAuthorized(origin, { roleId: user.role_id }))) {
        if (!user.is_active)
          throw new PreconditionFailedException('Inactive account found.');
        return excludeKeys({ ...user, ...personData }, [
          'password',
          'is_active',
          'created_by',
        ]);
      }
    }
    return null;
  }

  async login(req: Request, user: UserEntity) {
    await new Promise<void>((resolve, reject) =>
      req['login'](user, (err) => {
        if (err)
          reject(new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR));
        resolve();
      })
    );
  }

  /**
   * Verifies that a user has the required role to access a origin
   * @param userRoleId the user role id
   * @param origin user current origin
   * @param allowRoles authorised roles for the routes requested.
   * @returns returns a boolean
   */
  async isAuthorized(origin: string, { roleId, allowRoles }: RoleCheckOptions) {
    const role = await this.prismaService.role.findFirst({
      where: { role_id: roleId, origin },
    });
    return role && (allowRoles ? allowRoles.includes(role.role_name) : true);
  }

  async registerUser(
    { password, ...person }: SignUpDto,
    roleName: string,
    createdBy?: string
  ): Promise<UserEntity> {
    const user = await this.prismaService.person.findUnique({
      where: { email: person.email },
    });
    if (user) throw new ConflictException();
    const {
      login_id,
      role_id,
      person: registeredPerson,
    } = await this.prismaService.login.create({
      select: { login_id: true, role_id: true, person: true },
      data: {
        ...(createdBy ? { admin: { connect: { login_id: createdBy } } } : {}),
        password: bcrypt.hashSync(password, Number(process.env.SALT)),
        role: { connect: { role_name: roleName } },
        person: { create: person },
      },
    });
    return {
      login_id,
      role_id,
      ...registeredPerson,
    };
  }

  async authenticateUser(
    request: Request,
    profile: Profile
  ): Promise<UserEntity> {
    let user: UserEntity = null;
    const origin = new URL(request.headers.origin).host;

    const login = await this.prismaService.login.findFirst({
      select: { login_id: true, role_id: true, is_active: true, person: true },
      where: { person: { email: profile.username } },
    });
    const role = await this.prismaService.role.findFirst({
      where: { origin },
    });
    const {
      name: { familyName, givenName },
      username,
    } = profile;
    if (!login && (await this.isAuthorized(origin, { allowRoles: ['Client'] })))
      user = await this.registerUser(
        {
          email: username,
          first_name: givenName,
          last_name: familyName,
          preferred_lang: profile['_json']['locale'] ?? 'en',
          password: Math.random().toString(16).split('.')[1],
        },
        role.role_name
      );
    else if (
      login.is_active &&
      (await this.isAuthorized(origin, { roleId: login.role_id }))
    )
      user = {
        ...login.person,
        role_id: login.role_id,
        login_id: login.login_id,
      };
    else throw new UnauthorizedException();
    return user;
  }

  async resetPassword(email: string, origin: string, resetBy?: string) {
    const {
      login_id,
      person: { first_name, preferred_lang: lang },
    } = await this.prismaService.login.findFirstOrThrow({
      include: {
        person: { select: { first_name: true, preferred_lang: true } },
      },
      where: {
        person: { email },
        role: { origin },
      },
    });
    const { reset_password_id } = await this.prismaService.resetPassword.create(
      {
        data: {
          login: { connect: { login_id } },
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
          ...(resetBy ? { admin: { connect: { login_id: resetBy } } } : {}),
        },
      }
    );
    const { call_to_action, message, subtitle, title, object } =
      resetPasswordMessages;
    await this.mailerService.sendEmail({
      to: email,
      subject: object[lang],
      template: {
        messages: {
          title: title[lang],
          message: message[lang],
          call_to_action: call_to_action[lang],
          subtitle: subtitle(first_name)[lang],
          action: `https://${origin}/forgot-password/${reset_password_id}`,
        },
        template_name: 'default',
      },
    });
  }

  async setNewPassword(
    reset_password_id: string,
    new_password: string,
    origin: string
  ) {
    const {
      login: { login_id, is_active, password },
    } = await this.prismaService.resetPassword.findFirstOrThrow({
      select: { login: true },
      where: {
        reset_password_id,
        used_at: null,
        cancelled_at: null,
        expires_at: { gte: new Date() },
        login: { role: { origin } },
      },
    });
    await this.prismaService.login.update({
      data: {
        password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
        loginAudits: { create: { is_active, password, audited_by: login_id } },
        resetPasswords: {
          update: {
            data: { used_at: new Date() },
            where: { reset_password_id },
          },
        },
      },
      where: { login_id },
    });
  }

  async cancelResetPasswordRequet(reset_password_id: string) {
    await this.prismaService.resetPassword.findFirstOrThrow({
      select: { login_id: true },
      where: {
        expires_at: { gte: new Date() },
        reset_password_id,
        cancelled_at: null,
        used_at: null,
      },
    });

    await this.prismaService.resetPassword.update({
      data: { cancelled_at: new Date() },
      where: { reset_password_id },
    });
  }

  async getRole(role_id: string) {
    return await this.prismaService.role.findUnique({ where: { role_id } });
  }

  async findOne(loginId: string): Promise<User | null> {
    const user = await this.prismaService.login.findFirst({
      select: { login_id: true, role_id: true, person: true },
      where: { login_id: loginId, is_active: true },
    });
    if (user) {
      const { person, ...login } = user;
      return { ...login, ...person };
    }
    return null;
  }
}
