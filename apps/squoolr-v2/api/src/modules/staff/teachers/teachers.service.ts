import { GlomPrismaService } from '@glom/prisma';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import {
  CreateTeacherInput,
  IStaffService,
  StaffSelectParams,
  TeacherCreateFromInput,
  UpdateTeacherInput,
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity, TeacherEntity } from '../staff.dto';
import { excludeKeys, pickKeys } from '@glom/utils';

@Injectable()
export class TeachersService
  implements IStaffService<StaffEntity | TeacherEntity>
{
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_teacher_id: string) {
    const {
      Teacher: { Login, matricule, ...teacher },
      is_deleted,
      ...annual_teacher
    } = await this.prismaService.annualTeacher.findFirstOrThrow({
      select: StaffArgsFactory.getTeacherSelect(),
      where: { annual_teacher_id, is_deleted: false },
    });

    return new TeacherEntity({
      ...teacher,
      ...annual_teacher,
      ...StaffArgsFactory.getStaffEntity({ Login, is_deleted, matricule }),
      annual_teacher_id,
      role: StaffRole.TEACHER,
    });
  }

  async findAll(staffParams?: StaffSelectParams) {
    const teacherSelect = StaffArgsFactory.getStaffSelect(staffParams);
    const { academic_year_id, is_deleted, ...teacherWhereInput } =
      StaffArgsFactory.getStaffWhereInput(staffParams);
    const teachers = await this.prismaService.annualTeacher.findMany({
      select: {
        is_deleted: true,
        annual_teacher_id: true,
        Teacher: { select: excludeKeys(teacherSelect, ['is_deleted']) },
      },
      where: { academic_year_id, is_deleted, Teacher: teacherWhereInput },
    });
    return teachers.map(
      ({
        is_deleted,
        annual_teacher_id,
        Teacher: {
          matricule,
          Login: {
            login_id,
            Person,
            Logs: [log],
            AnnualConfigurators: [configrator],
            AnnualRegistries: [registry],
            Teacher: {
              AnnualTeachers: [{ AnnualClassroomDivisions: codinatedClass }],
            },
          },
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          is_deleted,
          annual_teacher_id,
          last_connected: log?.logged_in_at ?? null,
          annual_registry_id: registry?.annual_registry_id,
          annual_configurator_id: configrator?.annual_configurator_id,
          roles: [{ registry }, { configrator }, { codinatedClass }].reduce<
            StaffRole[]
          >(
            (roles, _) =>
              _.registry
                ? [...roles, StaffRole.REGISTRY]
                : _.configrator
                ? [...roles, StaffRole.CONFIGURATOR]
                : _.codinatedClass
                ? [...roles, StaffRole.COORDINATOR]
                : roles,
            [StaffRole.TEACHER]
          ),
          role: StaffRole.TEACHER,
        })
    );
  }

  async create(
    {
      teaching_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payers_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
      ...payload
    }: CreateTeacherInput,
    added_by: string
  ) {
    const { AcademicYear, Login } =
      StaffArgsFactory.getStaffCreateInput(payload);
    const {
      Teacher: {
        Login: { login_id, Person: person },
        ...teacher
      },
      ...annual_teacher
    } = await this.prismaService.annualTeacher.create({
      select: StaffArgsFactory.getTeacherSelect(),
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeachingGrade: { connect: { teaching_grade_id } },
        Teacher: {
          connectOrCreate: {
            create: {
              Login,
              has_tax_payers_card,
              tax_payer_card_number,
              matricule: payload.matricule,
              private_code: payload.private_code,
              TeacherType: { connect: { teacher_type_id } },
            },
            where: {},
          },
        },
        AcademicYear,
        CreatedBy: { connect: { annual_configurator_id: added_by } },
      },
    });

    return new TeacherEntity({
      login_id,
      roles: [],
      last_connected: null,
      ...teacher,
      ...person,
      ...annual_teacher,
      role: StaffRole.TEACHER,
    });
  }

  async update(
    annual_teacher_id: string,
    {
      teaching_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payers_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
      delete: archive,
      ...payload
    }: UpdateTeacherInput,
    audited_by: string
  ) {
    const {
      Teacher: {
        Login: { Person },
        ...teacher
      },
      is_deleted,
      ...annualTeacher
    } = await this.prismaService.annualTeacher.findUniqueOrThrow({
      select: {
        is_deleted: true,
        ...StaffArgsFactory.getTeacherSelect(),
      },
      where: { annual_teacher_id },
    });
    await this.prismaService.annualTeacher.update({
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeachingGrade: teaching_grade_id
          ? { connect: { teaching_grade_id } }
          : undefined,
        Teacher:
          has_tax_payers_card ||
          tax_payer_card_number ||
          teacher_type_id ||
          Object.keys(payload).length > 0
            ? {
                update: {
                  has_tax_payers_card,
                  tax_payer_card_number,
                  TeacherType: teacher_type_id
                    ? { connect: { teacher_type_id } }
                    : undefined,
                  TeacherAudits:
                    has_tax_payers_card ||
                    tax_payer_card_number ||
                    teacher_type_id
                      ? {
                          create: {
                            ...excludeKeys(teacher, ['matricule']),
                            audited_by,
                          },
                        }
                      : undefined,
                  Login:
                    Object.keys(payload).length > 0
                      ? {
                          update: {
                            Person: {
                              update: {
                                ...payload,
                                PersonAudits: { create: { ...Person } },
                              },
                            },
                          },
                        }
                      : undefined,
                },
              }
            : undefined,
        AnnualTeacherAudits:
          hourly_rate ||
          origin_institute ||
          has_signed_convention ||
          teaching_grade_id
            ? {
                create: {
                  is_deleted,
                  ...excludeKeys(annualTeacher, [
                    'teaching_grade_id',
                    'annual_teacher_id',
                  ]),
                  AuditedBy: {
                    connect: { annual_configurator_id: audited_by },
                  },
                },
              }
            : undefined,

        is_deleted: archive,
      },
      where: { annual_teacher_id },
    });
  }

  async createFrom(
    login_id: string,
    {
      matricule,
      academic_year_id,
      hourly_rate,
      origin_institute,
      private_code,
      teacher_type_id,
      teaching_grade_id,
      has_signed_convention,
      has_tax_payers_card,
      tax_payer_card_number,
    }: TeacherCreateFromInput,
    created_by: string
  ) {
    const existingTeacher = await this.prismaService.annualTeacher.findFirst({
      where: { academic_year_id, login_id },
    });
    const {
      Teacher: { Login, ...teacher },
      ...annualTeacher
    } = await this.prismaService.annualTeacher.upsert({
      select: {
        annual_teacher_id: true,
        ...StaffArgsFactory.getTeacherSelect(),
      },
      create: {
        hourly_rate: hourly_rate ?? 0,
        origin_institute: origin_institute ?? '',
        has_signed_convention: has_signed_convention,
        AcademicYear: { connect: { academic_year_id } },
        TeachingGrade: {
          connect: { teaching_grade_id: teaching_grade_id ?? '' },
        },
        Teacher: {
          connectOrCreate: {
            create: {
              matricule,
              private_code,
              has_tax_payers_card,
              tax_payer_card_number,
              Login: { connect: { login_id } },
              TeacherType: {
                connect: { teacher_type_id: teacher_type_id ?? '' },
              },
            },
            where: { login_id },
          },
        },
        CreatedBy: { connect: { annual_configurator_id: created_by } },
      },
      update: {
        is_deleted: false,
        AnnualTeacherAudits: {
          create: {
            ...(existingTeacher
              ? pickKeys(existingTeacher, [
                  'is_deleted',
                  'hourly_rate',
                  'origin_institute',
                  'has_signed_convention',
                ])
              : {
                  hourly_rate,
                  origin_institute,
                  has_signed_convention,
                  is_deleted: false,
                }),
            AuditedBy: {
              connect: { annual_configurator_id: created_by },
            },
          },
        },
      },
      where: {
        login_id_academic_year_id: { academic_year_id, login_id },
      },
    });

    return new TeacherEntity({
      ...StaffArgsFactory.getStaffEntity({
        is_deleted: false,
        matricule,
        Login,
      }),
      ...teacher,
      ...annualTeacher,
      role: StaffRole.TEACHER,
    });
  }

  async resetPrivateCodes(
    annualStaffIds: string[],
    codes: string[],
    reset_by: string
  ) {
    const teachers = await this.prismaService.annualTeacher.findMany({
      select: { annual_teacher_id: true, Teacher: true },
      where: {
        OR: annualStaffIds.map((annual_teacher_id) => ({
          annual_teacher_id,
        })),
      },
    });
    await this.prismaService.$transaction([
      ...teachers.map(
        (
          {
            annual_teacher_id,
            Teacher: {
              has_tax_payers_card,
              private_code,
              tax_payer_card_number,
              teacher_type_id,
            },
          },
          i
        ) =>
          this.prismaService.annualTeacher.update({
            data: {
              Teacher: {
                update: {
                  private_code: codes[i],
                  TeacherAudits: {
                    create: {
                      private_code,
                      has_tax_payers_card,
                      tax_payer_card_number,
                      TeacherType: { connect: { teacher_type_id } },
                      AuditedBy: {
                        connect: { annual_configurator_id: reset_by },
                      },
                    },
                  },
                },
              },
            },
            where: { annual_teacher_id },
          })
      ),
    ]);
  }
}
