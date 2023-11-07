import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import { BatchPayload } from '../../module';
import {
  CreateTeacherInput,
  IStaffService,
  StaffSelectParams,
  UpdateTeacherInput
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class TeachersService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  update(payload: UpdateTeacherInput): Promise<BatchPayload> {
    throw new Error('Method not implemented.');
  }
  async findOne(annual_teacher_id: string) {
    const {
      Teacher: { matricule, ...teacher },
      Login: { login_id, Person: person },
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
        Teacher: { select: { matricule: true } },
        ...StaffArgsFactory.getStaffSelect(staffParams),
      },
      where: StaffArgsFactory.getStaffWhereInput(staffParams),
    });
    return teachers.map(
      ({
        annual_teacher_id,
        Teacher: { matricule },
        Login: {
          login_id,
          Person,
          Logs: [log],
          AnnualConfigurators: [configrator],
          AnnualRegistries: [registry],
          AnnualTeachers: [{ AnnualClassroomDivisions: codinatedClass }],
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
    const {
      Teacher: { matricule, ...teacher },
      Login: { login_id, Person: person },
      ...annual_teacher
    } = await this.prismaService.annualTeacher.create({
      select: StaffArgsFactory.getTeacherSelect(),
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeachingGrade: { connect: { teaching_grade_id } },
        Teacher: {
          create: {
            has_tax_payers_card,
            tax_payer_card_number,
            matricule: payload.matricule,
            private_code: payload.private_code,
            TeacherType: { connect: { teacher_type_id } },
          },
        },
        AnnualConfigurator: { connect: { annual_configurator_id: added_by } },
        ...StaffArgsFactory.getStaffCreateInput(payload),
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
