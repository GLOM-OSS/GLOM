import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys } from '@glom/utils';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Login, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AcademicYearsService } from '../../modules/academic-years/academic-years.service';
import { PassportUser, SessionData } from './auth';
import { Role } from './auth.decorator';

export type MajorRole =
  | Extract<Role, Role.ADMIN | Role.PARENT | Role.STUDENT>
  | 'PERSONNEL';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: GlomPrismaService,
    private academicYearService: AcademicYearsService
  ) {}

  async validateUser(
    request: Request,
    email: string,
    password: string
  ): Promise<Express.User> {
    const origin = new URL(request.headers.origin).host;
    const person = await this.prismaService.person.findUnique({
      include: { Logins: true },
      where: { email },
    });
    if (!person)
      throw new UnauthorizedException('Incorrect email or password !!');
    const login = await this.getValidLogin(person.Logins, origin);
    if (!bcrypt.compareSync(password, login.password))
      throw new UnauthorizedException('Incorrect email or password !!');

    return {
      login_id: login.login_id,
      school_id: login.school_id,
      ...excludeKeys(person, ['Logins']),
    };
  }

  async authenticateUser(
    request: Request,
    email: string
  ): Promise<Express.User> {
    const origin = new URL(request.headers.origin).host;
    const person = await this.prismaService.person.findUnique({
      include: { Logins: true },
      where: { email },
    });
    if (!person) throw new UnauthorizedException();
    const login = await this.getValidLogin(person.Logins, origin);
    return {
      ...person,
      login_id: login.login_id,
      ...excludeKeys(person, ['Logins']),
    };
  }

  /**
   * Gets the first login whose priviligies are attached to the given origin
   * @param logins list of logins to validate
   * @param origin request origin
   * @returns a login from the given list
   */
  async getValidLogin(logins: Login[], origin: string): Promise<Login> {
    const loginsData = await Promise.all(
      logins.map(async (login) => {
        const { login_id, school_id } = login;
        const schoolId = school_id ? school_id : '';
        return {
          login,
          school: await this.prismaService.school.findFirst({
            where: { school_id: schoolId, is_validated: true },
          }),
          student: await this.prismaService.student.findFirst({
            where: { login_id, Login: { school_id: schoolId } },
          }),
        };
      })
    );
    const loginData = loginsData.find(
      ({ login: { is_parent, is_personnel }, school, student }) =>
        (school &&
          ((is_personnel &&
            this.checkOrigin(origin, 'PERSONNEL', school.subdomain)) ||
            (student &&
              this.checkOrigin(origin, Role.STUDENT, school.subdomain)))) ||
        (!school &&
          ((is_parent && this.checkOrigin(origin, Role.PARENT)) ||
            (!is_parent && this.checkOrigin(origin, Role.ADMIN))))
    );
    if (!loginData) throw new UnauthorizedException('Wrong origin !!!');
    const numberOfActiveSessions = await this.prismaService.log.count({
      where: {
        login_id: loginData.login.login_id,
        OR: {
          logged_out_at: null,
          closed_at: null,
        },
      },
    });
    if (numberOfActiveSessions > 2)
      throw new HttpException(
        { error: 'TOO_MANY_REQUESTS', message: 'Too many session opened !!' },
        HttpStatus.TOO_MANY_REQUESTS
      );
    return loginData.login;
  }

  private checkOrigin(origin: string, role: MajorRole, subdomain?: string) {
    const env = process.env.NODE_ENV;
    return (
      (role === Role.ADMIN && origin === process.env.ADMIN_URL) ||
      (role === Role.PARENT && origin === process.env.PARENT_URL) ||
      (role === Role.STUDENT &&
        origin ===
          (env === 'production'
            ? `${subdomain}.squoolr.com`
            : 'localhost:4200')) ||
      (role !== Role.ADMIN &&
        role !== Role.PARENT &&
        role !== Role.STUDENT &&
        origin ===
          (env === 'production'
            ? `${subdomain}-staff.squoolr.com`
            : 'localhost:4201'))
    );
  }

  async updateUserSession(request: Request, login_id: string) {
    let sessionData: SessionData = null;
    const academicYears = await this.academicYearService.findAll(login_id);
    const numberOfAcademicYear = academicYears.length;
    if (numberOfAcademicYear === 0)
      throw new NotFoundException('No academic year was found');
    else if (numberOfAcademicYear === 1) {
      const [{ academic_year_id }] = academicYears;
      // const { desirializedRoles: userRoles, roles } =
      const { sessionData: session } =
        await this.academicYearService.selectAcademicYear(
          login_id,
          academic_year_id
        );
      await this.updateSession(request, { academic_year_id });
      sessionData = session;
    }
    return { academicYears, sessionData };
  }

  async updateSession(
    request: Request,
    // payload: Pick<PassportUser, 'academic_year_id' | 'roles'>
    payload: Pick<PassportUser, 'academic_year_id'>
  ) {
    const user = request.session.passport.user;
    await new Promise((resolve) => {
      request.session.passport.user = { ...user, ...payload };
      request.session.save((err) => {
        if (err) throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        resolve(1);
      });
    });
  }

  async resetPassword(email: string, subdomain: string) {
    console.log({ subdomain });
    const login = await this.prismaService.login.findFirst({
      where: {
        Person: { email },
        School: subdomain !== process.env.ADMIN_URL ? { subdomain } : undefined,
      },
    });
    if (!login) throw new NotFoundException('Unknown email');
    const resetPasswords = await this.prismaService.resetPassword.count({
      where: { OR: { is_valid: true, expires_at: { gt: new Date() } } },
    });
    if (resetPasswords === 1)
      throw new ConflictException('Found pending reset password request');
    const { reset_password_id } = await this.prismaService.resetPassword.create(
      {
        data: {
          Login: { connect: { login_id: login.login_id } },
          expires_at: new Date(
            new Date().setMinutes(new Date().getMinutes() + 30)
          ),
        },
      }
    );
    Logger.verbose(reset_password_id, AuthService.name);
  }

  async setNewPassword(
    reset_password_id: string,
    new_password: string,
    subdomain: string
  ) {
    const resetPassword = await this.prismaService.resetPassword.findFirst({
      include: {
        Login: {
          select: {
            is_deleted: true,
            is_personnel: true,
            password: true,
          },
        },
      },
      where: {
        Login: {
          School:
            subdomain !== process.env.ADMIN_URL ? { subdomain } : undefined,
        },
        is_valid: true,
        reset_password_id,
        expires_at: { gte: new Date() },
      },
    });
    if (!resetPassword) throw new NotFoundException('Reset password not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Login: login } = resetPassword;
    return await this.prismaService.resetPassword.update({
      data: {
        is_valid: false,
        Login: {
          update: {
            password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
            LoginAudits: {
              create: login,
            },
          },
        },
      },
      where: { reset_password_id },
    });
  }

  async deserializeUser(user: PassportUser): Promise<Express.User> {
    const { academic_year_id, login_id } = user;
    const login = await this.prismaService.login.findFirst({
      include: { Person: true },
      where: { login_id },
    });
    if (!login) return null;
    const { Person: person } = login;
    let deserialedUser: Express.User;
    if (academic_year_id) {
      const { sessionData: availableRoles } =
        await this.academicYearService.selectAcademicYear(
          login_id,
          academic_year_id
        );
      deserialedUser = { ...deserialedUser, ...availableRoles };
    } else if (login.is_parent) {
      //check for parent students
      const parentStudents = await this.prismaService.student.findMany({
        select: { student_id: true },
        where: { tutor_id: login_id },
      });
      deserialedUser = {
        ...deserialedUser,
        tutorStudentIds: parentStudents.map((_) => _.student_id),
      };
    }
    return { login_id, ...person, ...deserialedUser };
  }

  async openSession(request: Request, login_id: string) {
    await this.prismaService.log.create({
      data: {
        log_id: request.sessionID,
        Login: { connect: { login_id } },
        user_agent: request.headers['user-agent'],
      },
    });
  }

  async closeSession(sessionID: string, payload: Prisma.LogUpdateInput) {
    await this.prismaService.log.update({
      data: payload,
      where: { log_id: sessionID },
    });
  }

  async validateOrigin(user: Express.User, origin: string) {
    const {
      login_id,
      annualConfigurator,
      annualRegistry,
      annualStudent,
      annualTeacher,
      tutorStudentIds,
    } = user;
    const school = await this.prismaService.school.findFirst({
      where: {
        Logins: {
          some: { login_id },
        },
      },
    });
    return (
      (login_id && this.checkOrigin(origin, Role.ADMIN)) || //Admin -> process.env.ADMIN_URL
      (annualStudent && this.checkOrigin(origin, Role.STUDENT)) || //Student -> `${school.subdomain}.squoolr.com`
      (tutorStudentIds && this.checkOrigin(origin, Role.PARENT)) || //Parent -> `parent.squoolr.com`
      ((annualConfigurator || annualRegistry || annualTeacher) &&
        this.checkOrigin(origin, 'PERSONNEL', school.subdomain)) //Personnel -> `admin.${school.subdomain}.squoolr.com`
    );
  }

  async getPerson(email: string) {
    return this.prismaService.person.findUnique({
      where: { email },
    });
  }

  async verifyPrivateCode(
    role: Role.REGISTRY | Role.TEACHER,
    { private_code, user_id }: { private_code: string; user_id: string }
  ) {
    let privateCode: string;

    if (role === Role.TEACHER) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { teacher_id: user_id },
      });
      privateCode = teacher?.private_code;
    } else {
      const registry = await this.prismaService.annualRegistry.findUnique({
        where: { annual_registry_id: user_id },
      });
      privateCode = registry?.private_code;
    }
    return privateCode && bcrypt.compareSync(private_code, privateCode);
  }
}
