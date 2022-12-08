import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Person } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH04, AUTH404, AUTH501, ERR03 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { Role } from '../../../utils/types';
import {
  CoordinatorPostDto,
  PersonnelQueryDto,
  StaffPostData,
  StaffPutDto
} from '../configurator.dto';

export type RoleShort = 'Te' | 'Se' | 'S.A.' | 'Co';

export interface Staff {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  login_id: string;
  personnel_code: string;
  annual_configurator_id?: string;
  annual_registry_id?: string;
  annual_teacher_id?: string;
}

export interface Personnel extends Staff {
  last_connected: Date;
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
    type: Role,
    academic_year_id: string,
    { keywords, is_deleted }: PersonnelQueryDto
  ): Promise<Personnel[]> {
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
      is_deleted,
    };

    const select = {
      is_deleted: true,
      Login: {
        select: {
          login_id: true,
          Person: {
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
          },
        },
      },
    };
    let person: Staff[];
    switch (type) {
      case Role.REGISTRY: {
        const registries = await this.annualRegistryService.findMany({
          select: {
            ...select,
            matricule: true,
            annual_registry_id: true,
          },
          where,
        });
        person = registries.map(
          ({ annual_registry_id, matricule, Login: { login_id, Person } }) => ({
            login_id,
            ...Person,
            personnel_id: annual_registry_id,
            personnel_code: matricule,
          })
        );
        break;
      }
      case Role.TEACHER: {
        const teachers = await this.annualTeacherService.findMany({
          select: {
            ...select,
            Teacher: { select: { matricule: true } },
            annual_teacher_id: true,
          },
          where,
        });
        person = teachers.map(
          ({
            annual_teacher_id,
            Teacher: { matricule },
            Login: { login_id, Person },
          }) => ({
            login_id,
            ...Person,
            personnel_id: annual_teacher_id,
            personnel_code: matricule,
          })
        );
        break;
      }
      case Role.CONFIGURATOR: {
        const configurators = await this.annualConfiguratorService.findMany({
          select: {
            ...select,
            matricule: true,
            annual_configurator_id: true,
          },
          where,
        });
        person = configurators.map(
          ({
            annual_configurator_id,
            matricule,
            Login: { login_id, Person },
          }) => ({
            login_id,
            ...Person,
            personnel_id: annual_configurator_id,
            personnel_code: matricule,
          })
        );
        break;
      }
      case Role.COORDINATOR: {
        const coordinators = await this.annualClassroomDivisionService.findMany(
          {
            distinct: ['annual_coordinator_id'],
            select: {
              AnnualTeacher: {
                select: {
                  ...select,
                  Teacher: { select: { matricule: true } },
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
              Teacher: { matricule },
              Login: { login_id, Person },
            },
          }) => ({
            login_id,
            ...Person,
            personnel_id: annual_teacher_id,
            personnel_code: matricule,
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
        last_connected: await this.getLastLog(login_id),
      });
    }
    return personnel;
  }

  async findOne(type: Role, annual_personnel_id: string) {
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
              national_id_number: true,
              gender: true,
              address: true,
              birthdate: true,
            },
          },
        },
      },
    };
    switch (type) {
      case Role.REGISTRY: {
        const {
          annual_registry_id,
          matricule,
          Login: { login_id, Person: person },
        } = await this.annualRegistryService.findFirst({
          select: {
            ...select,
            matricule: true,
            annual_registry_id: true,
          },
          where: { annual_registry_id: annual_personnel_id, is_deleted: false },
        });
        return {
          personnel_id: annual_registry_id,
          personnel_code: matricule,
          ...person,
          login_id,
        };
      }
      case Role.TEACHER: {
        const {
          Teacher: { matricule, ...teacher },
          annual_teacher_id,
          Login: { login_id, Person: person },
          ...annual_teacher
        } = await this.annualTeacherService.findFirst({
          select: {
            ...select,
            has_signed_convention: true,
            origin_institute: true,
            teaching_grade_id: true,
            hourly_rate: true,
            Teacher: {
              select: {
                matricule: true,
                has_tax_payers_card: true,
                tax_payer_card_number: true,
                teacher_type_id: true,
              },
            },
            annual_teacher_id: true,
          },
          where: { annual_teacher_id: annual_personnel_id, is_deleted: false },
        });

        return {
          personnel_id: annual_teacher_id,
          personnel_code: matricule,
          ...annual_teacher,
          ...teacher,
          ...person,
          login_id,
        };
      }
      case Role.CONFIGURATOR: {
        const {
          annual_configurator_id,
          matricule,
          Login: { login_id, Person: person },
        } = await this.annualConfiguratorService.findFirst({
          select: {
            ...select,
            matricule: true,
            annual_configurator_id: true,
          },
          where: {
            annual_configurator_id: annual_personnel_id,
            is_deleted: false,
          },
        });
        return {
          personnel_id: annual_configurator_id,
          personnel_code: matricule,
          login_id,
          ...person,
        };
      }
      default:
        throw new HttpException(
          JSON.stringify(AUTH501(type)),
          HttpStatus.NOT_IMPLEMENTED
        );
    }
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
    annual_personnel_id: string,
    role: Role,
    reset_by: string
  ) {
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
              has_tax_payers_card: true,
              tax_payer_card_number: true,
            },
          },
          Login: { select: { Person: { select: { email: true } } } },
        },
        where: { annual_teacher_id: annual_personnel_id },
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
        where: { annual_registry_id: annual_personnel_id },
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
        where: { annual_registry_id: annual_personnel_id },
      });
    }
    //TODO NodeMailer send email to username
    username;
  }

  async resetPassword(email: string, squoolr_client: string, reset_by: string) {
    const login = await this.loginService.findFirst({
      where: {
        Person: { email },
        // School: { subdomain: `admin.${squoolr_client}.squoolr.com` }, //TODO uncomment this line on production
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

    const { phone_number, ...staffData } = newStaff;
    const password = Math.random().toString(36).slice(2).toUpperCase();
    //TODO NodeMailer send generated password and private code

    const person = await this.personService.findUnique({
      where: { phone_number },
    });
    if (person?.phone_number)
      throw new HttpException(
        JSON.stringify(ERR03('phone_number')),
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
    const matricule = await this.codeGenerator.getPersonnelCode(
      school_id,
      role
    );

    const data = {
      matricule,
      Login: {
        connectOrCreate: {
          create: {
            login_id,
            is_personnel: true,
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
    let staff: {
      Login: { Person: Person };
      annual_registry_id?: string;
      annual_configurator_id?: string;
      matricule: string;
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
      staff = await this.annualConfiguratorService.create({
        select: {
          Login: { select: { Person: true } },
          annual_configurator_id: true,
          matricule: true,
        },
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
      staff = await this.annualRegistryService.create({
        select: {
          Login: { select: { Person: true } },
          annual_registry_id: true,
          matricule: true,
        },
        data: {
          ...data,
          private_code,
        },
      });
    }
    const {
      Login: { Person },
      matricule: personnel_code,
      annual_configurator_id,
      annual_registry_id,
    } = staff;
    return {
      ...Person,
      personnel_code,
      roles: await this.getRoles(login_id),
      last_connected: await this.getLastLog(login_id),
      personnel_id: annual_configurator_id ?? annual_registry_id,
    };
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
            ...classroom_division_ids.map((code) => ({
              AnnualClassroom: {
                //TODO change this when handling classroom divisions
                classroom_code: code,
              },
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
    { phone_number, ...staffData }: StaffPutDto,
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

  async archivePersonnel(
    annual_personnel_id: string,
    role: Role,
    audited_by: string
  ) {
    switch (role) {
      case Role.CONFIGURATOR: {
        await this.annualConfiguratorService.update({
          data: {
            is_deleted: false,
            deleted_at: new Date(),
            deleted_by: audited_by,
          },
          where: { annual_configurator_id: annual_personnel_id },
        });
        return;
      }
      case Role.REGISTRY: {
        const registry = await this.annualRegistryService.findUnique({
          where: { annual_registry_id: annual_personnel_id },
        });
        if (registry)
          throw new HttpException(
            JSON.stringify(AUTH404('Registry')),
            HttpStatus.NOT_FOUND
          );
        await this.annualRegistryService.update({
          data: {
            is_deleted: !registry.is_deleted,
            AnnualRegistryAudits: {
              create: { ...registry, audited_by },
            },
          },
          where: { annual_registry_id: annual_personnel_id },
        });
        return;
      }
      case Role.TEACHER: {
        const teacher = await this.annualTeacherService.findUnique({
          where: { annual_teacher_id: annual_personnel_id },
        });
        if (teacher)
          throw new HttpException(
            JSON.stringify(AUTH404('Teacher')),
            HttpStatus.NOT_FOUND
          );
        await this.annualTeacherService.update({
          data: {
            is_deleted: !teacher.is_deleted,
            AnnualTeacherAudits: {
              create: { ...teacher, audited_by },
            },
          },
          where: { annual_teacher_id: annual_personnel_id },
        });
        return;
      }
      case Role.COORDINATOR: {
        const annualClassroomDivisions =
          await this.annualClassroomDivisionService.findMany({
            select: {
              annual_classroom_division_id: true,
              annual_coordinator_id: true,
              is_deleted: true,
            },
            where: { annual_coordinator_id: annual_personnel_id },
          });
        await this.prismaService.$transaction([
          this.annualClassroomDivisionService.updateMany({
            data: { annual_coordinator_id: null },
            where: { annual_coordinator_id: annual_personnel_id },
          }),
          this.annualClassroomDivisionAuditService.createMany({
            data: annualClassroomDivisions.map((data) => ({
              ...data,
              audited_by,
            })),
          }),
        ]);
        return;
      }
      default:
        throw new HttpException(
          JSON.stringify(AUTH501(role)),
          HttpStatus.NOT_IMPLEMENTED
        );
    }
  }
}
