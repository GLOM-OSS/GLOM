import { PrismaService } from '../../../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { AUTH04, AUTH404, AUTH501 } from '../../../errors';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../utils/types';

export enum PersonnelType {
  REGISTRY,
  TEACHER,
  COORDINATOR,
  CONFIGURATOR,
}

export type RoleShort = 'Te' | 'Se' | 'S.A.' | 'Co';

export interface Person {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  login_id: string;
  annual_configurator_id?: string;
  annual_registry_id?: string;
  annual_teacher_id?: string;
}

export interface Personnel extends Person {
  last_log: Date;
  roles: RoleShort[];
}

@Injectable()
export class PersonnelService {
  private logService: typeof this.prismaService.log;
  private loginService: typeof this.prismaService.login;
  private resetPasswordService: typeof this.prismaService.resetPassword;
  private annualTeacherService: typeof this.prismaService.annualTeacher;
  private annualRegistryService: typeof this.prismaService.annualRegistry;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.logService = prismaService.log;
    this.loginService = prismaService.login;
    this.annualTeacherService = prismaService.annualTeacher;
    this.resetPasswordService = prismaService.resetPassword;
    this.annualRegistryService = prismaService.annualRegistry;
    this.annualConfiguratorService = prismaService.annualConfigurator;
  }

  async findAll(
    type: PersonnelType,
    academic_year_id: string,
    keywords?: string
  ): Promise<Person[]> {
    const where = {
      academic_year_id,
      Login: {
        Person: {
          OR: {
            email: {
              contains: keywords,
            },
            last_name: {
              contains: keywords,
            },
            first_name: {
              contains: keywords,
            },
          },
        },
      },
    };
    const select = {
      Login: {
        select: {
          login_id: true,
          Person: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              phone_number: true,
            },
          },
        },
      },
    };
    let person: Person[];
    switch (type) {
      case PersonnelType.REGISTRY: {
        const registries = await this.annualRegistryService.findMany({
          select: {
            ...select,
            annual_registry_id: true,
          },
          where,
        });
        person = registries.map(
          ({ annual_registry_id, Login: { login_id, Person } }) => ({
            login_id,
            ...Person,
            annual_registry_id,
          })
        );
        break;
      }
      case PersonnelType.TEACHER: {
        const teachers = await this.annualTeacherService.findMany({
          select: {
            ...select,
            annual_teacher_id: true,
          },
          where,
        });
        person = teachers.map(
          ({ annual_teacher_id, Login: { login_id, Person } }) => ({
            login_id,
            ...Person,
            annual_teacher_id,
          })
        );
        break;
      }
      case PersonnelType.CONFIGURATOR: {
        const configurators = await this.annualConfiguratorService.findMany({
          select: {
            ...select,
            annual_configurator_id: true,
          },
          where,
        });
        person = configurators.map(
          ({ annual_configurator_id, Login: { login_id, Person } }) => ({
            login_id,
            ...Person,
            annual_configurator_id,
          })
        );
        break;
      }
      case PersonnelType.COORDINATOR: {
        const coordinators = await this.annualClassroomDivisionService.findMany(
          {
            distinct: ['annual_coordinator_id'],
            select: {
              AnnualTeacher: {
                select: {
                  ...select,
                  annual_teacher_id: true,
                },
              },
            },
            where: {
              AnnualTeacher: { ...where },
            },
          }
        );
        person = coordinators.map(
          ({
            AnnualTeacher: {
              annual_teacher_id,
              Login: { login_id, Person },
            },
          }) => ({
            login_id,
            ...Person,
            annual_teacher_id,
          })
        );
        break;
      }
      default:
        throw new HttpException(
          JSON.stringify(AUTH501(type)),
          HttpStatus.NOT_IMPLEMENTED
        );
    }

    const personnel: Personnel[] = [];
    for (let i = 0; i < person.length; i++) {
      const { login_id, ...person } = personnel[i];
      personnel.push({
        login_id,
        ...person,
        roles: await this.getRoles(login_id),
        last_log: await this.getLastLog(login_id),
      });
    }
    return personnel;
  }

  async getRoles(login_id: string) {
    const roles: RoleShort[] = [];
    const teaher = await this.annualTeacherService.findFirst({
      where: { login_id },
    });
    if (teaher) roles.push('Te');
    const configrator = await this.annualConfiguratorService.findFirst({
      where: { login_id },
    });
    if (configrator) roles.push('Se');
    const registry = await this.annualRegistryService.findFirst({
      where: { login_id },
    });
    if (registry) roles.push('S.A.');
    const annualCordinator =
      await this.annualClassroomDivisionService.findFirst({
        select: { AnnualTeacher: { select: { annual_teacher_id: true } } },
        where: { AnnualTeacher: { login_id } },
      });
    if (annualCordinator?.AnnualTeacher.annual_teacher_id) roles.push('Co');
    return roles;
  }

  async getLastLog(login_id: string) {
    const log = await this.logService.findFirst({
      orderBy: {
        logged_in_at: 'desc',
      },
      select: { logged_in_at: true },
      where: { login_id },
    });

    return log?.logged_in_at;
  }

  async resetPrivateCode(
    personnel_id: string,
    role: Role,
    reset_by: string
  ) {
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );

    if (role === Role.TEACHER) {
      const annualTeacher = await this.annualTeacherService.findUnique({
        select: {
          hourly_rate: true,
          has_signed_convention: true,
          origin_institute: true,
        },
        where: { annual_teacher_id: personnel_id },
      });
      await this.annualTeacherService.update({
        data: {
          private_code,
          AnnualTeacherAudits: {
            create: {
              ...annualTeacher,
              AnnualConfigurator: {
                connect: { annual_configurator_id: reset_by },
              },
            },
          },
        },
        where: { annual_teacher_id: personnel_id },
      });
    } else if (role === Role.REGISTRY) {
      const annualRegistry = await this.annualRegistryService.findUnique({
        select: {
          is_deleted: true,
          private_code: true,
        },
        where: { annual_registry_id: personnel_id },
      });
      await this.annualRegistryService.update({
        data: {
          private_code,
          AnnualRegistryAudits: {
            create: {
              ...annualRegistry,
              AnnualConfigurator: {
                connect: { annual_configurator_id: reset_by },
              },
            },
          },
        },
        where: { annual_registry_id: personnel_id },
      });
    }
  }

  async resetPassword(email: string, squoolr_client: string, reset_by: string) {
    const login = await this.loginService.findFirst({
      where: {
        Person: { email },
        School: { subdomain: `admin.${squoolr_client}` },
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
          AnnualConfigurator: {
            connect: { annual_configurator_id: reset_by },
          },
        },
      });

      return { reset_password_id };
    }
    throw new HttpException(AUTH404('Email')['Fr'], HttpStatus.NOT_FOUND);
  }
}
