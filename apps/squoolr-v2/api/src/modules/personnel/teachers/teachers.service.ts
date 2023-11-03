import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { StaffEntity } from '../staff.dto';
import { IStaffService } from '../staff';
import { QueryParams } from '../../module';
import { Role } from '../../../app/auth/auth.decorator';
import { StaffArgsFactory } from '../staff-args.factory';

@Injectable()
export class TeachersService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  findOne: (
    academic_year_id: string,
    params?: QueryParams
  ) => Promise<StaffEntity>;

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const teachers = await this.prismaService.annualTeacher.findMany({
      select: {
        annual_teacher_id: true,
        Teacher: { select: { matricule: true } },
        ...StaffArgsFactory.getStaffSelect(
          academic_year_id,
          Role.COORDINATOR,
          params
        ),
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
            Role[]
          >(
            (roles, _) =>
              _.registry
                ? [...roles, Role.REGISTRY]
                : _.configrator
                ? [...roles, Role.CONFIGURATOR]
                : _.codinatedClass
                ? [...roles, Role.COORDINATOR]
                : roles,
            [Role.TEACHER]
          ),
        })
    );
  }
}
