import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { StaffEntity } from '../staff.dto';
import { getStaffSelect, getStaffWhereInput } from '../staff.service';
import { IStaffService } from '../staff';
import { QueryParams } from '../../module';
import { Role } from '../../../app/auth/auth.decorator';

@Injectable()
export class CoordinatorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  findOne: (
    academic_year_id: string,
    params?: QueryParams
  ) => Promise<StaffEntity>;

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const coordinators =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          AnnualTeacher: {
            select: {
              annual_teacher_id: true,
              Teacher: { select: { matricule: true } },
              ...getStaffSelect(academic_year_id, Role.COORDINATOR, params),
            },
          },
        },
        where: {
          AnnualTeacher: getStaffWhereInput(academic_year_id, params),
        },
      });
    return coordinators.map(
      ({
        AnnualTeacher: {
          annual_teacher_id,
          Teacher: { matricule },
          Login: {
            login_id,
            Person,
            Logs: [log],
            AnnualConfigurators: [configrator],
            AnnualRegistries: [registry],
          },
        },
      }) =>
        new StaffEntity({
          login_id,
          matricule,
          ...Person,
          annual_teacher_id,
          last_connected: log?.logged_in_at ?? null,
          roles: [{ registry }, { configrator }].reduce<Role[]>(
            (roles, _) =>
              _.registry
                ? [...roles, Role.REGISTRY]
                : _.configrator
                ? [...roles, Role.CONFIGURATOR]
                : roles,
            [Role.TEACHER, Role.COORDINATOR]
          ),
        })
    );
  }
}
