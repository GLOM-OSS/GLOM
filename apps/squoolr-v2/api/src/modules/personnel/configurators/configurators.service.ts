import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { StaffEntity } from '../staff.dto';
import { getStaffWhereInput, getStaffSelect } from '../staff.service';
import { IStaffService } from '../staff';
import { QueryParams } from '../../module';
import { Role } from '../../../app/auth/auth.decorator';

@Injectable()
export class ConfiguratorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  findOne: (
    academic_year_id: string,
    params?: QueryParams
  ) => Promise<StaffEntity>;

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const configurators = await this.prismaService.annualConfigurator.findMany({
      select: {
        matricule: true,
        annual_configurator_id: true,
        ...getStaffSelect(academic_year_id, Role.CONFIGURATOR, params),
      },
      where: getStaffWhereInput(academic_year_id, params),
    });
    return configurators.map(
      ({
        annual_configurator_id,
        matricule,
        Login: {
          login_id,
          Person,
          Logs: [log],
          AnnualRegistries: [registry],
          AnnualTeachers: [teacher],
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          annual_configurator_id,
          last_connected: log?.logged_in_at ?? null,
          roles: [{ registry }, { teacher }].reduce<Role[]>(
            (roles, _) =>
              _.registry
                ? [...roles, Role.REGISTRY]
                : _.teacher
                ? _.teacher.AnnualClassroomDivisions
                  ? [...roles, Role.TEACHER, Role.COORDINATOR]
                  : [...roles, Role.TEACHER]
                : roles,
            [Role.CONFIGURATOR]
          ),
        })
    );
  }
}
