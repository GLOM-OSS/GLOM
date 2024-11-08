import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AcademicYearStatus, Login } from '@prisma/client';
import { CronJobEvents, TasksService } from '@glom/nest-tasks';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AUTH02, AUTH04, AUTH401, AUTH404, sAUTH404 } from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DeserializeSessionData,
  DesirializeRoles,
  PassportSession,
  Role,
  UserRole,
} from '../../utils/types';

@Injectable()
export class AuthService {
  private logService: typeof this.prismaService.log;
  private loginService: typeof this.prismaService.login;
  private schoolService: typeof this.prismaService.school;
  private personService: typeof this.prismaService.person;
  private studentService: typeof this.prismaService.student;
  private loginAuditService: typeof this.prismaService.loginAudit;
  private academicYearService: typeof this.prismaService.academicYear;
  private resetPasswordService: typeof this.prismaService.resetPassword;
  private annualStudentService: typeof this.prismaService.annualStudent;
  private annualTeacherService: typeof this.prismaService.annualTeacher;
  private annualRegistryService: typeof this.prismaService.annualRegistry;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;

  constructor(
    private prismaService: PrismaService,
    private tasksService: TasksService
  ) {
    this.logService = prismaService.log;
    this.loginService = prismaService.login;
    this.schoolService = prismaService.school;
    this.personService = prismaService.person;
    this.studentService = prismaService.student;
    this.loginAuditService = prismaService.loginAudit;
    this.academicYearService = prismaService.academicYear;
    this.resetPasswordService = prismaService.resetPassword;
    this.annualStudentService = prismaService.annualStudent;
    this.annualTeacherService = prismaService.annualTeacher;
    this.annualRegistryService = prismaService.annualRegistry;
    this.annualConfiguratorService = prismaService.annualConfigurator;
    this.annualClassroomDivisionService = prismaService.annualClassroomDivision;
  }

  async validateUser(request: Request, email: string, password: string) {
    const person = await this.personService.findUnique({ where: { email } });
    if (person) {
      const userLogins = (await this.loginService.findMany({
        where: { person_id: person?.person_id },
      })) as Login[];
      for (let i = 0; i < userLogins.length; i++) {
        const login = userLogins[i];
        if (bcrypt.compareSync(password, login.password)) {
          try {
            const user = await this.validateLogin(request, login);
            return {
              ...user,
              ...person,
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
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: JSON.stringify(AUTH401),
    });
  }

  async locallyValidateUser(request: Request, email: string) {
    const person = await this.personService.findUnique({ where: { email } });
    if (person) {
      const userLogins = (await this.loginService.findMany({
        where: { person_id: person?.person_id },
      })) as Login[];
      for (let i = 0; i < userLogins.length; i++) {
        const login = userLogins[i];
        const user = await this.validateLogin(request, login);
        return {
          ...user,
          ...person,
          login_id: login.login_id,
        };
      }
    }
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: AUTH401['fr'],
    });
  }

  async validateLogin(request: Request, login: Omit<Login, 'password'>) {
    const origin = new URL(request.headers.origin).host;
    const { login_id, school_id, is_personnel, is_parent, cookie_age } = login;

    let user: Omit<PassportSession, 'log_id'> = {
      login_id,
      cookie_age,
      roles: [],
    };
    const activeLogs = await this.logService.count({
      where: {
        login_id,
        OR: {
          logged_out_at: null,
          closed_at: null,
        },
      },
    });
    if (activeLogs === 3) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Unauthorized access',
        message: JSON.stringify(AUTH02),
      });
    }
    if (is_parent && !this.checkOrigin(origin, Role.PARENT)) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH401['fr'],
      });
    } else if (school_id) {
      const school = await this.schoolService.findFirst({
        where: { school_id, is_validated: true },
      });
      if (this.checkOrigin(origin, Role.STUDENT, school.subdomain)) {
        const student = await this.studentService.findFirst({
          where: { login_id },
        });
        if (!student)
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized access',
            message: AUTH401['fr'],
          }); //someone attempting to be a student
      } else if (
        !is_personnel ||
        !this.checkOrigin(origin, Role.CONFIGURATOR, school.subdomain)
      )
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['fr'],
        }); //someone attempting to be a personnel
    } else {
      if (!this.checkOrigin(origin, Role.ADMIN))
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['fr'],
        }); //attempting to be an admin
      user = {
        ...user,
        roles: [
          {
            role: Role.ADMIN,
            user_id: login_id,
          },
        ],
      };
    }
    const { log_id, job_name } = await this.logIn(
      request,
      user.login_id,
      user.cookie_age
    );
    return { log_id, ...user, job_name };
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

  async getActiveRoles(
    login_id: string,
    academic_year_id: string
  ): Promise<{ userRoles: UserRole[]; availableRoles: DesirializeRoles }> {
    const userRoles: UserRole[] = [];
    const { school_id } = await this.loginService.findUnique({
      where: { login_id },
    });

    if (!school_id)
      return { userRoles: [], availableRoles: {} as DesirializeRoles };
    const { started_at, ended_at, starts_at, ends_at, year_code, year_status } =
      await this.academicYearService.findFirst({
        where: {
          academic_year_id,
          is_deleted: false,
        },
      });

    let availableRoles: DesirializeRoles = {
      login_id,
      school_id,
      activeYear: {
        year_code,
        year_status,
        academic_year_id,
        starting_date:
          year_status !== AcademicYearStatus.INACTIVE ? started_at : starts_at,
        ending_date:
          year_status !== AcademicYearStatus.FINISHED ? ends_at : ended_at,
      },
    };

    //check for annual student
    const annualStudent = await this.annualStudentService.findFirst({
      select: {
        student_id: true,
        annual_student_id: true,
        Student: {
          select: {
            Classroom: { select: { classroom_code: true, level: true } },
          },
        },
        AnnualStudentHasCreditUnits: {
          distinct: ['semester_number'],
          select: { semester_number: true },
        },
      },
      where: {
        academic_year_id,
        is_deleted: false,
        Student: { login_id },
      },
    });
    if (annualStudent) {
      const {
        student_id,
        annual_student_id,
        Student: {
          Classroom: { classroom_code, level: classroom_level },
        },
        AnnualStudentHasCreditUnits: crediUnits,
      } = annualStudent;
      availableRoles = {
        ...availableRoles,
        annualStudent: {
          student_id,
          classroom_code,
          classroom_level,
          annual_student_id,
          activeSemesters: crediUnits.map((_) => _.semester_number),
        },
      };
      userRoles.push({
        user_id: annualStudent.annual_student_id,
        role: Role.STUDENT,
      });
    } else {
      //check for annual configurator
      const annualConfigurator = await this.annualConfiguratorService.findFirst(
        {
          where: {
            login_id,
            academic_year_id,
            is_deleted: false,
          },
        }
      );
      if (annualConfigurator) {
        const { annual_configurator_id, is_sudo } = annualConfigurator;
        availableRoles = {
          ...availableRoles,
          annualConfigurator: { annual_configurator_id, is_sudo },
        };
        userRoles.push({
          user_id: annualConfigurator.annual_configurator_id,
          role: Role.CONFIGURATOR,
        });
      }

      //check for annual registry
      const annualRegistry = await this.annualRegistryService.findFirst({
        where: {
          login_id,
          academic_year_id,
          is_deleted: false,
        },
      });
      if (annualRegistry) {
        const { annual_registry_id } = annualRegistry;
        availableRoles = {
          ...availableRoles,
          annualRegistry: { annual_registry_id },
        };
        userRoles.push({
          user_id: annualRegistry.annual_registry_id,
          role: Role.REGISTRY,
        });
      }

      //check for annual teacher
      const annualTeacher = await this.annualTeacherService.findFirst({
        where: {
          academic_year_id,
          is_deleted: false,
          login_id,
        },
      });
      if (annualTeacher) {
        const {
          annual_teacher_id,
          has_signed_convention,
          hourly_rate,
          origin_institute,
          teacher_id,
        } = annualTeacher;
        userRoles.push({
          user_id: annual_teacher_id,
          role: Role.TEACHER,
        });
        const classroomDivisions =
          await this.annualClassroomDivisionService.findMany({
            where: { annual_coordinator_id: annual_teacher_id },
          });
        if (classroomDivisions.length > 0)
          userRoles.push({
            user_id: annual_teacher_id,
            role: Role.COORDINATOR,
          });
        availableRoles = {
          ...availableRoles,
          annualTeacher: {
            classroomDivisions: classroomDivisions.map(
              ({ annual_classroom_division_id: id }) => id
            ),
            annual_teacher_id,
            has_signed_convention,
            hourly_rate,
            origin_institute,
            teacher_id,
          },
        };
      }
    }
    return { availableRoles, userRoles };
  }

  async resetPassword(email: string, squoolr_client: string) {
    const login = await this.loginService.findFirst({
      where: {
        Person: { email },
        School:
          squoolr_client !== process.env.ADMIN_URL
            ? { subdomain: squoolr_client }
            : undefined,
      },
    });
    if (login) {
      const resetPasswords = await this.prismaService.resetPassword.count({
        where: { OR: { is_valid: true, expires_at: { gt: new Date() } } },
      });
      if (resetPasswords === 1)
        throw new HttpException(AUTH04['fr'], HttpStatus.NOT_FOUND);
      const { reset_password_id } = await this.resetPasswordService.create({
        data: {
          Login: { connect: { login_id: login.login_id } },
          expires_at: new Date(
            new Date().setMinutes(new Date().getMinutes() + 30)
          ),
        },
      });

      return { reset_password_id };
    }
    throw new HttpException(AUTH404('Email')['fr'], HttpStatus.NOT_FOUND);
  }

  async setNewPassword(
    reset_password_id: string,
    new_password: string,
    squoolr_client: string
  ) {
    const resetPassword = await this.resetPasswordService.findFirst({
      include: {
        Login: {
          select: {
            cookie_age: true,
            is_deleted: true,
            is_personnel: true,
            password: true,
            login_id: true,
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
    if (resetPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Login: login } = resetPassword;
      return await this.prismaService.$transaction([
        this.loginAuditService.create({ data: login }),
        this.loginService.update({
          data: {
            password: bcrypt.hashSync(new_password, Number(process.env.SALT)),
          },
          where: { login_id: login.login_id },
        }),
        this.resetPasswordService.update({
          data: { is_valid: false },
          where: { reset_password_id },
        }),
      ]);
    }
    throw new HttpException(sAUTH404['fr'], HttpStatus.NOT_FOUND);
  }

  async deserializeUser(
    user: PassportSession
  ): Promise<DeserializeSessionData> {
    const { academic_year_id, login_id } = user;
    const person = await this.personService.findFirst({
      include: { Logins: true },
      where: { Logins: { some: { login_id } } },
    });
    if (!person) return null;

    const {
      Logins: [login],
    } = person;
    let deserialedUser: DeserializeSessionData;
    if (academic_year_id) {
      const { availableRoles } = await this.getActiveRoles(
        login_id,
        academic_year_id
      );
      deserialedUser = { ...deserialedUser, ...availableRoles };
    } else if (login.is_parent) {
      //check for parent students
      const parentStudents = await this.studentService.findMany({
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
    const { log_id } = await this.logService.create({
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
    await this.logService.update({
      data: { closed_at: new Date() },
      where: { log_id },
    });
  }

  async isClientCorrect(
    deserialedUser: DeserializeSessionData,
    squoolr_client: string
  ) {
    const {
      login_id,
      annualConfigurator,
      annualRegistry,
      annualStudent,
      annualTeacher,
      tutorStudentIds,
    } = deserialedUser;
    const school = await this.schoolService.findFirst({
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

  async getUser(email: string) {
    return this.personService.findUnique({
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        national_id_number: true,
        gender: true,
        address: true,
        birthdate: true,
      },
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
