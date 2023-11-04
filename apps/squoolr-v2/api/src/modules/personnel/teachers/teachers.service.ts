import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { CreateStaffInput, IStaffService } from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffRole } from '../../../utils/enums';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class TeachersService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  create: (
    payload: CreateStaffInput,
    created_by: string,
    private_code: string
  ) => Promise<StaffEntity>;

  async findOne(annual_teacher_id: string) {
    const {
      Teacher: { matricule, ...teacher },
      Login: { login_id, Person: person },
      ...annual_teacher
    } = await this.prismaService.annualTeacher.findFirstOrThrow({
      select: {
        ...StaffArgsFactory.getStaffSelect(),
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
      },
      where: { annual_teacher_id },
    });

    return new StaffEntity({
      ...teacher,
      ...person,
      ...annual_teacher,
      login_id,
      matricule,
      roles: [],
      annual_teacher_id,
      last_connected: null,
    });
  }

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const teachers = await this.prismaService.annualTeacher.findMany({
      select: {
        annual_teacher_id: true,
        Teacher: { select: { matricule: true } },
        ...StaffArgsFactory.getStaffSelect({
          activeRole: StaffRole.COORDINATOR,
          academic_year_id,
          params,
        }),
      },
      where: StaffArgsFactory.getStaffWhereInput(academic_year_id, params),
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
}
