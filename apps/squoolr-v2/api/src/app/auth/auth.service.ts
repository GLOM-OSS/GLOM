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
import { SessionData, PassportUser, ValidatedUser } from './auth';
import { Role } from './auth.decorator';

export type MajorRole =
  | Extract<Role, Role.ADMIN | Role.PARENT | Role.STUDENT>
  | 'PERSONNEL';
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
  ): Promise<Express.User> {
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
        const isLoginValid = await this.isValidLogin(request, login);
        if (isLoginValid) {
          return {
            ...person,
            login_id: login.login_id,
            school_id: login.school_id,
          };
        }
      }
    }
    throw new UnauthorizedException('Wrong origin !!!');
  }

  async authenticateUser(
    request: Request,
    email: string
  ): Promise<Express.User> {
    const person = await this.prismaService.person.findUnique({
      where: { email },
    });
    if (!person) throw new UnauthorizedException();
    const userLogins = (await this.prismaService.login.findMany({
      where: { person_id: person?.person_id },
    })) as Login[];
    for (let i = 0; i < userLogins.length; i++) {
      const login = userLogins[i];
      const isLoginValid = await this.isValidLogin(request, login);
      if (isLoginValid)
        return {
          ...person,
          login_id: login.login_id,
        };
    }
    throw new UnauthorizedException('Wrong origin !!!');
  }

  async isValidLogin(request: Request, login: Login) {
    const origin = new URL(request.headers.origin).host;
    const { login_id, school_id, is_personnel, is_parent } = login;

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
    const schoolId = school_id ? school_id : '';
    const [school, student] = await Promise.all([
      this.prismaService.school.findFirst({
        where: { school_id: schoolId, is_validated: true },
      }),
      this.prismaService.student.findFirst({
        where: { login_id, Login: { school_id: schoolId } },
      }),
    ]);
    return (
      (school &&
        ((is_personnel &&
          this.checkOrigin(origin, 'PERSONNEL', school.subdomain)) ||
          (student &&
            this.checkOrigin(origin, Role.STUDENT, school.subdomain)))) ||
      (!school &&
        ((is_parent && this.checkOrigin(origin, Role.PARENT)) ||
          (!is_parent && this.checkOrigin(origin, Role.ADMIN))))
    );
  }

  private checkOrigin(origin: string, role: MajorRole, subdomain?: string) {
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

  async openSession(sessionID: string, login_id: string) {
    await this.prismaService.log.create({
      data: {
        log_id: sessionID,
        Login: { connect: { login_id } },
      },
    });
  }

  async closeSession(sessionID: string) {
    await this.prismaService.log.update({
      data: { closed_at: new Date() },
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
