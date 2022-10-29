import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH04, AUTH404, AUTH501, ERR03 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { Role } from '../../../utils/types';
import {
  CoordinatorPostDto,
  StaffPostData,
  StaffPutDto,
  TeacherPostDto,
  TeacherPutDto,
} from '../configurator.dto';

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
  private personService: typeof this.prismaService.person;
  private resetPasswordService: typeof this.prismaService.resetPassword;
  private teacherService: typeof this.prismaService.teacher;
  private annualTeacherService: typeof this.prismaService.annualTeacher;
  private annualRegistryService: typeof this.prismaService.annualRegistry;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;
  private annualClassroomDivisionAuditService: typeof this.prismaService.annualClassroomDivisionAudit;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.logService = prismaService.log;
    this.loginService = prismaService.login;
    this.personService = prismaService.person;
    this.teacherService = prismaService.teacher;
    this.annualTeacherService = prismaService.annualTeacher;
    this.resetPasswordService = prismaService.resetPassword;
    this.annualRegistryService = prismaService.annualRegistry;
    this.annualConfiguratorService = prismaService.annualConfigurator;
    this.annualClassroomDivisionService = prismaService.annualClassroomDivision;
    this.annualClassroomDivisionAuditService =
      prismaService.annualClassroomDivisionAudit;
  }

  async findAll(
    type: PersonnelType,
    academic_year_id: string,
    keywords?: string
  ): Promise<Person[]> {
    const where = {
      academic_year_id,
      ...(keywords
        ? {
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
          }
        : {}),
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
      const { login_id, ...personData } = person[i];
      personnel.push({
        login_id,
        ...personData,
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

  async resetPrivateCode(personnel_id: string, role: Role, reset_by: string) {
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    let username: string;

    if (role === Role.TEACHER) {
      const annualTeacher = await this.annualTeacherService.findUnique({
        select: {
          Teacher: {
            select: {
              teacher_id: true,
              private_code: true,
              teacher_type_id: true,
              has_tax_payer_card: true,
              tax_payer_card_number: true,
            },
          },
          Login: { select: { Person: { select: { email: true } } } },
        },
        where: { annual_teacher_id: personnel_id },
      });
      if (!annualTeacher)
        throw new HttpException(
          JSON.stringify(AUTH404('Teacher')),
          HttpStatus.NOT_FOUND
        );
      const {
        Login: { Person },
        Teacher: { teacher_id, ...teacher },
      } = annualTeacher;
      username = Person.email;
      await this.teacherService.update({
        data: {
          private_code,
          TeacherAudits: {
            create: {
              ...teacher,
              audited_by: reset_by,
            },
          },
        },
        where: { teacher_id },
      });
    } else if (role === Role.REGISTRY) {
      const annualRegistry = await this.annualRegistryService.findUnique({
        select: {
          is_deleted: true,
          private_code: true,
          Login: { select: { Person: { select: { email: true } } } },
        },
        where: { annual_registry_id: personnel_id },
      });
      const {
        Login: { Person },
        ...annualRegistryAudit
      } = annualRegistry;
      username = Person.email;
      await this.annualRegistryService.update({
        data: {
          private_code,
          AnnualRegistryAudits: {
            create: {
              ...annualRegistryAudit,
              AnnualConfigurator: {
                connect: { annual_configurator_id: reset_by },
              },
            },
          },
        },
        where: { annual_registry_id: personnel_id },
      });
    }
    //TODO NodeMailer send email to username
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

  async addNewStaff(
    newStaff: StaffPostData,
    { school_id, role }: { school_id: string; role: Role },
    academic_year_id: string,
    added_by: string
  ) {
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );

    const { phone: phone_number, ...staffData } = newStaff;
    const password = Math.random().toString(36).slice(2).toUpperCase();

    const person = await this.personService.findUnique({
      where: { phone_number },
    });
    if (person?.phone_number)
      throw new HttpException(
        JSON.stringify(ERR03('phone')),
        HttpStatus.AMBIGUOUS
      );

    const login = await this.loginService.findFirst({
      select: {
        login_id: true,
        Person: { select: { phone_number: true } },
      },
      where: {
        Person: { email: newStaff.email },
        school_id,
      },
    });
    const login_id = login?.login_id ?? randomUUID();

    const data = {
      Login: {
        connectOrCreate: {
          create: {
            login_id,
            Person: {
              connectOrCreate: {
                create: { ...staffData, phone_number },
                where: { email: newStaff.email },
              },
            },
            password,
          },
          where: { login_id },
        },
      },
      AcademicYear: { connect: { academic_year_id } },
      AnnualConfigurator: {
        connect: { annual_configurator_id: added_by },
      },
    };
    if (role === Role.CONFIGURATOR) {
      if (login?.login_id) {
        const staff = await this.annualConfiguratorService.findUnique({
          where: {
            login_id_academic_year_id: {
              academic_year_id,
              login_id: login.login_id,
            },
          },
        });
        if (staff)
          throw new HttpException(
            JSON.stringify(ERR03('configurator')),
            HttpStatus.AMBIGUOUS
          );
      }
      await this.annualConfiguratorService.create({
        data,
      });
    } else if (role === Role.REGISTRY) {
      if (login?.login_id) {
        const staff = await this.annualRegistryService.findUnique({
          where: {
            login_id_academic_year_id: {
              academic_year_id,
              login_id: login.login_id,
            },
          },
        });
        if (staff)
          throw new HttpException(
            JSON.stringify(ERR03('registry')),
            HttpStatus.AMBIGUOUS
          );
      }
      await this.annualRegistryService.create({
        data: {
          ...data,
          private_code,
        },
      });
    }
  }

  async addNewTeacher(
    {
      phone,
      first_name,
      birthdate,
      email,
      gender,
      last_name,
      national_id_number,
      teacher_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payer_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
    }: TeacherPostDto,
    {
      academic_year_id,
      school_id,
    }: { academic_year_id: string; school_id: string },
    added_by: string
  ) {
    const person = await this.personService.findUnique({
      where: { phone_number: phone },
    });
    if (person?.phone_number)
      throw new HttpException(
        JSON.stringify(ERR03('phone')),
        HttpStatus.AMBIGUOUS
      );

    const login = await this.loginService.findFirst({
      where: {
        school_id,
        Person: { email },
      },
    });
    if (login?.login_id) {
      const staff = await this.annualTeacherService.findUnique({
        where: {
          login_id_academic_year_id: {
            academic_year_id,
            login_id: login.login_id,
          },
        },
      });
      if (staff)
        throw new HttpException(
          JSON.stringify(ERR03('teacher')),
          HttpStatus.AMBIGUOUS
        );
    }

    const login_id = login?.login_id ?? randomUUID();
    const password = Math.random().toString(36).slice(2).toUpperCase();
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    await this.annualTeacherService.create({
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeacherGrade: { connect: { teacher_grade_id } },
        Teacher: {
          create: {
            private_code,
            tax_payer_card_number,
            has_tax_payer_card,
            TeacherType: { connect: { teacher_type_id } },
          },
        },
        AcademicYear: { connect: { academic_year_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: added_by } },
        Login: {
          connectOrCreate: {
            create: {
              login_id,
              password,
              School: { connect: { school_id } },
              Person: {
                connectOrCreate: {
                  create: {
                    email,
                    gender,
                    last_name,
                    birthdate,
                    first_name,
                    national_id_number,
                    phone_number: phone,
                  },
                  where: { email },
                },
              },
            },
            where: { login_id },
          },
        },
      },
    });
  }

  async addNewCoordinator(data: CoordinatorPostDto, added_by: string) {
    const { annual_teacher_id, classroom_division_ids } = data;
    const annualClassroomDivisions =
      await this.annualClassroomDivisionService.findMany({
        select: {
          annual_classroom_division_id: true,
          annual_coordinator_id: true,
          is_deleted: true,
        },
        where: {
          OR: [
            ...classroom_division_ids.map((id) => ({
              annual_classroom_division_id: id,
            })),
          ],
        },
      });
    await this.prismaService.$transaction([
      this.annualClassroomDivisionAuditService.createMany({
        data: [
          ...annualClassroomDivisions.map((data) => ({
            ...data,
            audited_by: added_by,
          })),
        ],
      }),
      this.annualClassroomDivisionService.updateMany({
        data: {
          annual_coordinator_id: annual_teacher_id,
        },
        where: {
          OR: [
            ...annualClassroomDivisions.map(
              ({ annual_classroom_division_id }) => ({
                annual_classroom_division_id,
              })
            ),
          ],
        },
      }),
    ]);
  }

  async editStaff(
    login_id: string,
    { phone: phone_number, ...staffData }: StaffPutDto,
    audited_by: string
  ) {
    const login = await this.loginService.findUnique({
      where: { login_id },
      select: {
        Person: true,
      },
    });
    if (!login?.Person)
      throw new HttpException(
        JSON.stringify(AUTH404('Personnel')),
        HttpStatus.NOT_FOUND
      );
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Person: { created_at, person_id, ...person },
    } = login;
    await this.personService.update({
      data: {
        ...staffData,
        phone_number,
        PersonAudits: {
          create: {
            ...person,
            AnnualConfigurator: {
              connect: { annual_configurator_id: audited_by },
            },
          },
        },
      },
      where: {
        person_id: login.Person.person_id,
      },
    });
  }

  async editTeacher(
    annual_teacher_id: string,
    {
      phone,
      first_name,
      birthdate,
      email,
      gender,
      last_name,
      national_id_number,
      teacher_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payer_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
    }: TeacherPutDto,
    audited_by: string
  ) {
    const annualTeacherData = await this.annualTeacherService.findUnique({
      where: { annual_teacher_id },
      select: {
        hourly_rate: true,
        origin_institute: true,
        has_signed_convention: true,
        Teacher: true,
        Login: {
          select: {
            Person: true,
          },
        },
      },
    });
    if (!annualTeacherData)
      throw new HttpException(
        JSON.stringify(AUTH404('Personnel')),
        HttpStatus.NOT_FOUND
      );
    const {
      Login: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Person: { created_at, person_id, ...person },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Teacher: { teacher_id, ...teacher },
      ...annualTeacher
    } = annualTeacherData;

    await this.annualTeacherService.update({
      data: {
        has_signed_convention,
        origin_institute,
        hourly_rate,
        TeacherGrade: { update: { teacher_grade_id } },
        AnnualTeacherAudits: {
          create: {
            ...annualTeacher,
            audited_by,
          },
        },
        Teacher: {
          update: {
            tax_payer_card_number,
            has_tax_payer_card,
            teacher_type_id,
            TeacherAudits: {
              create: {
                ...teacher,
                audited_by,
              },
            },
          },
        },
        Login: {
          update: {
            Person: {
              update: {
                first_name,
                birthdate,
                email,
                gender,
                last_name,
                national_id_number,
                phone_number: phone,
                PersonAudits: {
                  create: {
                    ...person,
                    AnnualConfigurator: {
                      connect: { annual_configurator_id: audited_by },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        annual_teacher_id,
      },
    });
  }
}
