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
import { KeyRole, Role, StaffRole } from '../../utils/enums';
import { AnnualSessionData, PassportUser } from './auth';
import { UserEntity } from './auth.dto';
import { LogsService } from './logs/logs.service';

@Injectable()
export class AuthService {
  constructor(
    private logsService: LogsService,
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
    const login = await this.findValidLogin(origin, person.Logins);
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
    const login = await this.findValidLogin(origin, person.Logins);
    return {
      ...person,
      login_id: login.login_id,
      ...excludeKeys(person, ['Logins']),
    };
  }

  async getAnnualSessionData(request: Request, login_id: string) {
    const academicYears = await this.academicYearService.findByLoginId(
      login_id
    );
    const numberOfAcademicYear = academicYears.length;
    if (numberOfAcademicYear === 0)
      throw new NotFoundException('No academic year was found');
    else if (numberOfAcademicYear === 1) {
      const [{ academic_year_id }] = academicYears;
      const annualSessionData =
        await this.academicYearService.selectAcademicYear(
          login_id,
          academic_year_id
        );
      await this.updateSession(request, { academic_year_id });
      return annualSessionData;
    }
  }

  async updateSession(
    request: Request,
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

  async createSessionLog(request: Request) {
    await this.logsService.create({
      log_id: request.sessionID,
      login_id: request.user.login_id,
      user_agent: request.headers['user-agent'],
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
    const {
      Login: { School: school, ...login },
    } = await this.prismaService.resetPassword.findFirstOrThrow({
      include: {
        Login: {
          select: {
            is_deleted: true,
            is_personnel: true,
            password: true,
            School: { select: { subdomain: true } },
          },
        },
      },
      where: {
        is_valid: true,
        reset_password_id,
        expires_at: { gte: new Date() },
      },
    });
    if (
      school &&
      !subdomain.includes('localhost') &&
      !subdomain.includes(school.subdomain)
    )
      throw new UnauthorizedException('Unauthorized domain');
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

  async deserializeUser({
    academic_year_id,
    login_id,
  }: PassportUser): Promise<Express.User> {
    const login = await this.prismaService.login.findFirst({
      include: { Person: true },
      where: {
        login_id,
        Logs: { some: { closed_at: null, logged_out_at: null } },
      },
    });
    if (!login) return null;
    const { Person: person, is_parent, school_id } = login;
    let deserialedUser: Express.User;
    if (academic_year_id) {
      const academicYearData =
        await this.academicYearService.selectAcademicYear(
          login_id,
          academic_year_id
        );
      deserialedUser = { ...deserialedUser, ...academicYearData };
    } else if (is_parent) {
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
    return { login_id, school_id, ...person, ...deserialedUser };
  }

  getUser({
    activeYear,
    annualConfigurator,
    annualRegistry,
    annualStudent,
    annualTeacher,
    ...person
  }: Express.User) {
    return new UserEntity({
      ...person,
      active_year_id: activeYear?.academic_year_id,
      roles: [
        ...(annualConfigurator ? [Role.CONFIGURATOR] : []),
        ...(annualRegistry ? [Role.REGISTRY] : []),
        ...(annualStudent ? [Role.STUDENT] : []),
        ...(annualTeacher ? [Role.TEACHER] : []),
      ],
    });
  }

  async validateOriginAccess(user: Express.User, origin: string) {
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
      (login_id && this.verifyOrigin(origin, KeyRole.ADMIN)) || //Admin -> process.env.ADMIN_URL
      (annualStudent && this.verifyOrigin(origin, KeyRole.STUDENT)) || //Student -> `${school.subdomain}.squoolr.com`
      (tutorStudentIds && this.verifyOrigin(origin, KeyRole.PARENT)) || //Parent -> `parent.squoolr.com`
      ((annualConfigurator || annualRegistry || annualTeacher) &&
        this.verifyOrigin(origin, KeyRole.STAFF, school.subdomain)) //Personnel -> `${school.subdomain}-staff.squoolr.com`
    );
  }

  async validateRolesAccess(user: Express.User, roles: Role[]) {
    return roles.some(
      (role) =>
        (user.tutorStudentIds && role === Role.PARENT) ||
        (user.annualConfigurator && role === Role.CONFIGURATOR) ||
        (user.annualRegistry && role === Role.REGISTRY) ||
        (user.annualTeacher && role === Role.TEACHER) ||
        (user.annualStudent && role === Role.STUDENT) ||
        (!user.school_id && role === Role.ADMIN)
    );
  }

  async validatePrivateAccess(request: Request, roles: Role[]) {
    const { login_id, annualRegistry } = request.user;
    const private_code = request.body['private_code'];

    return (
      (roles.includes(Role.TEACHER) &&
        (await this.verifyPrivateCode(StaffRole.TEACHER, {
          private_code,
          user_id: login_id,
        }))) ||
      (roles.includes(Role.REGISTRY) &&
        (await this.verifyPrivateCode(StaffRole.REGISTRY, {
          private_code,
          user_id: annualRegistry?.annual_registry_id,
        })))
    );
  }

  /**
   * Gets the first login whose priviligies are attached to the given origin
   * @param origin request origin
   * @param logins list of logins to validate
   * @returns a login from the given list
   */
  private async findValidLogin(
    origin: string,
    logins: Login[]
  ): Promise<Login> {
    const loginsData = await Promise.all(
      logins.map(async (login) => {
        const { login_id, school_id } = login;
        const schoolId = school_id ? school_id : '';
        return {
          login,
          school: await this.prismaService.school.findFirst({
            where: {
              school_id: schoolId,
              is_validated: true,
              SchoolDemand: { demand_status: 'VALIDATED' },
            },
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
            this.verifyOrigin(origin, KeyRole.STAFF, school.subdomain)) ||
            (student &&
              this.verifyOrigin(origin, KeyRole.STUDENT, school.subdomain)))) ||
        (!school &&
          ((is_parent && this.verifyOrigin(origin, KeyRole.PARENT)) ||
            (!is_parent && this.verifyOrigin(origin, KeyRole.ADMIN))))
    );
    if (!loginData) throw new UnauthorizedException('Wrong origin !!!');

    const activeSessionCount = await this.logsService.count(
      loginData.login.login_id,
      { closed_at: null, logged_out_at: null }
    );
    if (activeSessionCount > 2)
      throw new HttpException(
        { error: 'TOO_MANY_REQUESTS', message: 'Too many session opened !!' },
        HttpStatus.TOO_MANY_REQUESTS
      );
    return loginData.login;
  }

  private verifyOrigin(origin: string, role: KeyRole, subdomain?: string) {
    const env = process.env.NODE_ENV;
    return (
      (role === KeyRole.ADMIN && origin === process.env.ADMIN_URL) ||
      (role === KeyRole.PARENT && origin === process.env.PARENT_URL) ||
      (role === KeyRole.STUDENT &&
        origin ===
          (env === 'production'
            ? `${subdomain}.squoolr.com`
            : 'localhost:4200')) ||
      (role === KeyRole.STAFF &&
        origin ===
          (env === 'production'
            ? `${subdomain}-staff.squoolr.com`
            : 'localhost:4201'))
    );
  }

  async verifyPrivateCode(
    role: StaffRole.REGISTRY | StaffRole.TEACHER,
    { private_code, user_id }: { private_code: string; user_id: string }
  ) {
    let privateCode: string;

    if (role === StaffRole.TEACHER) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { login_id: user_id },
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
