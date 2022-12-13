import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AcademicYearStatus, Login } from '@prisma/client';
import { CronJobEvents, TasksService } from '@squoolr/tasks';
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
            if (
              i === userLogins.length - 1 &&
              error?.statusCode === HttpStatus.UNAUTHORIZED
            )
              throw new HttpException(error?.message, error?.statusCode);
          }
        }
      }
    }
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: AUTH401['Fr'],
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
      message: AUTH401['Fr'],
    });
  }

  async validateLogin(request: Request, login: Omit<Login, 'password'>) {
    const origin = request.headers.origin; // new URL(request.headers.origin).hostname;
    const { login_id, school_id, cookie_age } = login;

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
    if (activeLogs >= 3) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Unauthorized access',
        message: AUTH02['Fr'],
      });
    }

    if (school_id) {
      const school = await this.schoolService.findFirst({
        where: { school_id, is_validated: true },
      });
      if (origin === 'http://localhost:4200') {
        //origin === `${school.subdomain}.squoolr.com`
        const student = await this.studentService.findFirst({
          where: { login_id },
        });
        if (!student)
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized access',
            message: AUTH401['Fr'],
          }); //someone attempting to be a student
      } else if (!login.is_personnel || origin !== `http://localhost:4201`)
        //origin !== `admin.${school.subdomain}.squoolr.com`
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['Fr'],
        }); //someone attempting to be a personnel
    } else {
      if (origin !== 'http://localhost:4202')
        //process.env.ADMIN_URL
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['Fr'],
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
      where: {
        academic_year_id,
        is_deleted: false,
        Student: { login_id },
      },
    });
    if (annualStudent) {
      const { annual_student_id, student_id } = annualStudent;
      availableRoles = {
        ...availableRoles,
        annualStudent: { annual_student_id, student_id },
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
        throw new HttpException(AUTH04['Fr'], HttpStatus.NOT_FOUND);
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
    throw new HttpException(AUTH404('Email')['Fr'], HttpStatus.NOT_FOUND);
  }

  async setNewPassword(
    reset_password_id: string,
    new_password: string,
    squoolr_client: string
  ) {
    const login = await this.loginService.findFirst({
      where: {
        School:
          squoolr_client !== process.env.ADMIN_URL
            ? { subdomain: squoolr_client }
            : undefined,
        ResetPasswords: {
          some: {
            reset_password_id,
            is_valid: true,
            expires_at: { gte: new Date() },
          },
        },
      },
    });
    if (login) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { created_at, person_id, school_id, ...data } = login;
      await this.prismaService.$transaction([
        this.loginAuditService.create({ data }),
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
    throw new HttpException(sAUTH404['Fr'], HttpStatus.NOT_FOUND);
  }

  async deserializeUser(user: PassportSession) {
    const { academic_year_id, login_id, roles } = user;
    const person = await this.personService.findFirst({
      where: { Logins: { some: { login_id } } },
    });
    const login = await this.loginService.findUnique({
      where: { login_id },
    });
    if (!login) return null;

    const { school_id } = login;
    if (!academic_year_id)
      return school_id ? null : { ...person, login_id, school_id };

    const { started_at, ended_at, starts_at, ends_at, year_code, year_status } =
      await this.academicYearService.findFirst({
        where: {
          academic_year_id,
          is_deleted: false,
        },
      });

    let deserialedUser: DeserializeSessionData = {
      login_id,
      ...person,
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
    for (let i = 0; i < roles.length; i++) {
      const { user_id, role } = roles[i];
      if (role === Role.STUDENT) {
        deserialedUser = {
          ...deserialedUser,
          annualStudent: await this.annualStudentService.findFirst({
            where: {
              annual_student_id: user_id,
              is_deleted: false,
            },
          }),
        };
        break;
      } else {
        switch (role) {
          case Role.CONFIGURATOR: {
            const { annual_configurator_id, is_sudo } =
              await this.annualConfiguratorService.findFirst({
                where: {
                  annual_configurator_id: user_id,
                  is_deleted: false,
                },
              });
            deserialedUser = {
              ...deserialedUser,
              annualConfigurator: { annual_configurator_id, is_sudo },
            };
            break;
          }
          case Role.REGISTRY: {
            const { annual_registry_id } =
              await this.annualRegistryService.findFirst({
                where: {
                  annual_registry_id: user_id,
                  is_deleted: false,
                },
              });
            deserialedUser = {
              ...deserialedUser,
              annualRegistry: { annual_registry_id },
            };
            break;
          }
          case Role.TEACHER: {
            const {
              annual_teacher_id,
              has_signed_convention,
              hourly_rate,
              origin_institute,
              teacher_id,
            } = await this.annualTeacherService.findFirst({
              where: {
                annual_teacher_id: user_id,
                is_deleted: false,
              },
            });
            const classroomDivisions =
              await this.annualClassroomDivisionService.findMany({
                where: { annual_coordinator_id: user_id },
              });
            deserialedUser = {
              ...deserialedUser,
              annualTeacher: {
                classroomDivisions: classroomDivisions.map(
                  ({ annual_classroom_division_id: id }) => id
                ),
                has_signed_convention,
                annual_teacher_id,
                origin_institute,
                hourly_rate,
                teacher_id,
              },
            };
            break;
          }
        }
      }
    }

    return deserialedUser;
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
    } = deserialedUser;
    const school = await this.schoolService.findFirst({
      where: {
        Logins: {
          some: { login_id },
        },
      },
    });
    return (
      (login_id && squoolr_client === 'http://localhost:4202') || //Admin -> process.env.ADMIN_URL
      (annualStudent && squoolr_client === 'http://localhost:4200') || //Student -> `${school.subdomain}.squoolr.com`
      ((annualConfigurator || annualRegistry || annualTeacher) &&
        squoolr_client === 'http://localhost:4201') //Personnel -> `admin.${school.subdomain}.squoolr.com`
    );
  }

  async getUser(email: string) {
    return this.personService.findUnique({ where: { email } });
  }
}
