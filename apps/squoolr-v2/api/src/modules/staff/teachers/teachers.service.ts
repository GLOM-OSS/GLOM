import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import {
  CreateTeacherInput,
  IStaffService,
  StaffSelectParams,
  TeacherCreateFromInput,
  UpdateTeacherInput,
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class TeachersService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_teacher_id: string) {
    const {
      Teacher: {
        matricule,
        Login: { login_id, Person: person },
        ...teacher
      },
      ...annual_teacher
    } = await this.prismaService.annualTeacher.findFirstOrThrow({
      select: StaffArgsFactory.getTeacherSelect(),
      where: { annual_teacher_id },
    });

    return new StaffEntity({
      login_id,
      matricule,
      roles: [],
      annual_teacher_id,
      last_connected: null,
      ...teacher,
      ...person,
      ...annual_teacher,
    });
  }

  async findAll(staffParams?: StaffSelectParams) {
    const teachers = await this.prismaService.annualTeacher.findMany({
      select: {
        annual_teacher_id: true,
        Teacher: {
          select: {
            matricule: true,
            ...StaffArgsFactory.getStaffSelect(staffParams),
          },
        },
      },
      where: StaffArgsFactory.getStaffWhereInput(staffParams),
    });
    return teachers.map(
      ({
        annual_teacher_id,
        Teacher: {
          matricule,
          is_deleted,
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
          annual_teacher_id,
          last_connected: log?.logged_in_at ?? null,
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
        matricule,
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
        AnnualConfigurator: { connect: { annual_configurator_id: added_by } },
      },
    });

    return new StaffEntity({
      login_id,
      matricule,
      roles: [],
      last_connected: null,
      ...teacher,
      ...person,
      ...annual_teacher,
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
      ...payload
    }: UpdateTeacherInput,
    audited_by: string
  ) {
    const {
      Teacher: {
        Login: { Person },
        ...teacher
      },
      ...annualTeacher
    } = await this.prismaService.annualTeacher.findUniqueOrThrow({
      select: {
        is_deleted: true,
        ...StaffArgsFactory.getTeacherSelect(),
      },
      where: { annual_teacher_id },
    });
    const isDeleted = payload.delete ? !annualTeacher.is_deleted : undefined;
    await this.prismaService.annualTeacher.update({
      data: {
        ...(isDeleted !== undefined
          ? { is_deleted: isDeleted }
          : {
              hourly_rate,
              origin_institute,
              has_signed_convention,
              TeachingGrade: teaching_grade_id
                ? { connect: { teaching_grade_id } }
                : undefined,
              Teacher: {
                update: {
                  has_tax_payers_card,
                  tax_payer_card_number,
                  TeacherType: teacher_type_id
                    ? { connect: { teacher_type_id } }
                    : undefined,
                  TeacherAudits: {
                    create: {
                      ...teacher,
                      audited_by,
                    },
                  },
                  Login: {
                    update: {
                      Person: {
                        update: {
                          ...payload,
                          PersonAudits: { create: { ...Person } },
                        },
                      },
                    },
                  },
                },
              },
            }),
        AnnualTeacherAudits: {
          create: {
            ...annualTeacher,
            AnnualConfigurator: {
              connect: { annual_configurator_id: audited_by },
            },
          },
        },
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
    const {
      Teacher: {
        Login: { Person: person },
        ...teacher
      },
      ...annual_teacher
    } = await this.prismaService.annualTeacher.upsert({
      select: StaffArgsFactory.getTeacherSelect(),
      create: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        AcademicYear: { connect: { academic_year_id } },
        TeachingGrade: { connect: { teaching_grade_id } },
        Teacher: {
          connectOrCreate: {
            create: {
              matricule,
              private_code,
              has_tax_payers_card,
              tax_payer_card_number,
              Login: { connect: { login_id } },
              TeacherType: { connect: { teacher_type_id } },
            },
            where: { login_id },
          },
        },
        AnnualConfigurator: { connect: { annual_configurator_id: created_by } },
      },
      update: { is_deleted: false },
      where: {
        login_id_academic_year_id: { academic_year_id, login_id },
      },
    });

    return new StaffEntity({
      login_id,
      matricule,
      roles: [],
      last_connected: null,
      ...teacher,
      ...person,
      ...annual_teacher,
    });
  }
}
