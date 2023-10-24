import { CronJobEvents, TasksService } from '@glom/nest-tasks';
import { GlomPrismaService } from '@glom/prisma';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Login } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AcademicYearsService } from '../academic-years/academic-years.service';
import { DesirializeSession, PassportUser, ValidatedUser } from './auth';
import { Role } from './auth.decorator';

@Injectable()
export class AuthService {
  constructor(
    private tasksService: TasksService,
    private prismaService: GlomPrismaService,
    private academicYearService: AcademicYearsService
  ) {}

  async validateUser(
    request: Request,
    email: string,
    password: string
  ): Promise<ValidatedUser> {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (!person) throw new UnauthorizedException();
    const userLogins: Login[] = await this.prismaService.login.findMany({
      where: { person_id: person?.person_id },
    });
    for (let i = 0; i < userLogins.length; i++) {
      const login = userLogins[i];
      if (bcrypt.compareSync(password, login.password)) {
        try {
          const user = await this.validateLogin(request, login);
          return {
            ...person,
            session: user,
            login_id: login.login_id,
            school_id: login.school_id,
          };
        } catch (error) {
          if (i === userLogins.length - 1)
            throw new HttpException(error?.message, error?.statusCode);
        }
      }
    }
  }

  async authenticateUser(
    request: Request,
    email: string
  ): Promise<ValidatedUser> {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (!person) throw new UnauthorizedException();
    const userLogins = (await this.prismaService.login.findMany({
      where: { person_id: person?.person_id },
    })) as Login[];
    for (let i = 0; i < userLogins.length; i++) {
      const login = userLogins[i];
      const user = await this.validateLogin(request, login);
      return {
        ...person,
        session: user,
        login_id: login.login_id,
      };
    }
  }

  async validateLogin(
    request: Request,
    login: Omit<Login, 'password'>
  ): Promise<PassportUser> {
    const origin = new URL(request.headers.origin).host;
    const { login_id, school_id, is_personnel, is_parent, cookie_age } = login;

    let user: Omit<PassportUser, 'log_id'> = {
      login_id,
      // cookie_age,
      // roles: [],
    };
    const activeLogs = await this.prismaService.log.count({
      where: {
        login_id,
        OR: {
          logged_out_at: null,
          closed_at: null,
        },
      },
    });
    if (activeLogs === 3) {
      throw new HttpException(
        'TOO_MANY_REQUESTS',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    if (is_parent && !this.checkOrigin(origin, Role.PARENT)) {
      throw new UnauthorizedException('Parent not  right origin');
    } else if (school_id) {
      const school = await this.prismaService.school.findFirst({
        where: { school_id, is_validated: true },
      });
      if (this.checkOrigin(origin, Role.STUDENT, school.subdomain)) {
        const student = await this.prismaService.student.findFirst({
          where: { login_id },
        });
        if (!student) throw new UnauthorizedException('Not a student'); //someone attempting to be a student
      } else if (
        !is_personnel ||
        !this.checkOrigin(origin, Role.CONFIGURATOR, school.subdomain)
      )
        throw new UnauthorizedException('Not a personnel'); //someone attempting to be a personnel
    } else {
      if (!this.checkOrigin(origin, Role.ADMIN))
        throw new UnauthorizedException('Not admin'); //attempting to be an admin
      // user = {
      //   ...user,
      //   roles: [
      //     {
      //       role: Role.ADMIN,
      //       user_id: login_id,
      //     },
      //   ],
      // };
    }
    const { log_id, job_name } = await this.logIn(
      request,
      user.login_id,
      3600
      // user.cookie_age
    );
    return { login_id };
  }

  private checkOrigin(origin: string, role: Role, subdomain?: string) {
    const env = process.env.NODE_ENV;
    return (
      (role === Role.ADMIN &&
        origin ===
          (env === 'production' ? process.env.ADMIN_URL : 'localhost:4202')) ||
      (role === Role.PARENT &&
        origin ===
          (env === 'production' ? `parent.squoolr.com` : 'localhost:4203')) ||
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
            ? `admin.${subdomain}.squoolr.com`
            : 'localhost:4201'))
    );
  }

  async updateUserSession(request: Request, login_id: string) {
    let desirializedRoles: DesirializeSession | null = null;
    const academicYears = await this.academicYearService.findAll(login_id);
    const numberOfAcademicYear = academicYears.length;
    if (numberOfAcademicYear === 0)
      throw new NotFoundException('No academic year was found');
    else if (numberOfAcademicYear === 1) {
      const [{ academic_year_id }] = academicYears;
      // const { desirializedRoles: userRoles, roles } =
      const { desirializedRoles: userRoles } =
        await this.academicYearService.retrieveRoles(
          login_id,
          academic_year_id
        );
      await this.updateSession(request, { academic_year_id });
      desirializedRoles = userRoles;
    }
    return { academicYears, desirializedRoles };
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

  async resetPassword(email: string, squoolr_client: string) {
    const login = await this.prismaService.login.findFirst({
      where: {
        Person: { email },
        School:
          squoolr_client !== process.env.ADMIN_URL
            ? { subdomain: squoolr_client }
            : undefined,
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
    squoolr_client: string
  ) {
    const resetPassword = await this.prismaService.resetPassword.findFirst({
      include: {
        Login: {
          select: {
            cookie_age: true,
            is_deleted: true,
            is_personnel: true,
            password: true,
          },
        },
      },
      where: {
        Login: {
          School:
            process.env.NODE_ENV === 'production' &&
            squoolr_client !== process.env.ADMIN_URL
              ? { subdomain: squoolr_client }
              : undefined,
        },
        is_valid: true,
        reset_password_id,
        expires_at: { gte: new Date() },
      },
    });
    if (resetPassword) throw new NotFoundException('Reset password not found');

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
    const person = await this.prismaService.person.findFirst({
      include: { Logins: true },
      where: { Logins: { some: { login_id } } },
    });
    if (!person) return null;

    const {
      Logins: [login],
    } = person;
    let deserialedUser: Express.User;
    if (academic_year_id) {
      const { desirializedRoles: availableRoles } =
        await this.academicYearService.retrieveRoles(
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

  async logIn(request: Request, login_id: string, cookie_age: number) {
    const { log_id } = await this.prismaService.log.create({
      data: {
        Login: { connect: { login_id } },
      },
    });
    const now = new Date();
    const job_name = this.tasksService.addCronJob(
      CronJobEvents.AUTO_LOGOUT,
      new Date(now.setSeconds(now.getSeconds() + cookie_age)),
      () => {
        request.session.destroy(async (err) => {
          if (!err) await this.closeSession(log_id);
        });
      }
    );
    return { job_name, log_id };
  }

  async closeSession(log_id: string) {
    await this.prismaService.log.update({
      data: { closed_at: new Date() },
      where: { log_id },
    });
  }

  async isClientCorrect(deserialedUser: Express.User, squoolr_client: string) {
    const {
      login_id,
      annualConfigurator,
      annualRegistry,
      annualStudent,
      annualTeacher,
      tutorStudentIds,
    } = deserialedUser;
    const school = await this.prismaService.school.findFirst({
      where: {
        Logins: {
          some: { login_id },
        },
      },
    });
    return (
      (login_id && this.checkOrigin(squoolr_client, Role.ADMIN)) || //Admin -> process.env.ADMIN_URL
      (annualStudent && this.checkOrigin(squoolr_client, Role.STUDENT)) || //Student -> `${school.subdomain}.squoolr.com`
      (tutorStudentIds && this.checkOrigin(squoolr_client, Role.PARENT)) || //Parent -> `parent.squoolr.com`
      ((annualConfigurator || annualRegistry || annualTeacher) &&
        this.checkOrigin(squoolr_client, Role.CONFIGURATOR, school.subdomain)) //Personnel -> `admin.${school.subdomain}.squoolr.com`
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
