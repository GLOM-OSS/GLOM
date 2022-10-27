import { HttpException, HttpStatus } from '@nestjs/common';
import { AUTH501 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';

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

export class PersonnelService {
  private annualRegistryService: typeof this.prismaService.annualRegistry;
  private annualTeacherService: typeof this.prismaService.annualTeacher;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  private logService: typeof this.prismaService.log;

  constructor(private prismaService: PrismaService) {
    this.logService = prismaService.log;
    this.annualTeacherService = prismaService.annualTeacher;
    this.annualRegistryService = prismaService.annualRegistry;
    this.annualClassroomService = prismaService.annualClassroom;
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
        const coordinators = await this.annualClassroomService.findMany({
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
        });
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
    const annualCordinator = await this.annualClassroomService.findFirst({
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
}
