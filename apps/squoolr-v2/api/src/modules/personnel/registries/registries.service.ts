import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { StaffEntity } from '../staff.dto';
import { IStaffService } from '../staff';
import { QueryParams } from '../../module';
import { Role } from '../../../app/auth/auth.decorator';
import { StaffArgsFactory } from '../staff-args.factory';

@Injectable()
export class RegistriesService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  findOne: (
    academic_year_id: string,
    params?: QueryParams
  ) => Promise<StaffEntity>;

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const registries = await this.prismaService.annualRegistry.findMany({
      select: {
        matricule: true,
        annual_registry_id: true,
        ...StaffArgsFactory.getStaffSelect({
          activeRole: Role.COORDINATOR,
          academic_year_id,
          params,
        }),
      },
      where: StaffArgsFactory.getStaffWhereInput(academic_year_id, params),
    });
    return registries.map(
      ({
        annual_registry_id,
        matricule,
        Login: {
          login_id,
          Person,
          Logs: [log],
          AnnualConfigurators: [configrator],
          AnnualTeachers: [teacher],
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          annual_registry_id,
          last_connected: log?.logged_in_at ?? null,
          roles: [{ configrator }, { teacher }].reduce<Role[]>(
            (roles, _) =>
              _.configrator
                ? [...roles, Role.CONFIGURATOR]
                : _.teacher
                ? _.teacher.AnnualClassroomDivisions
                  ? [...roles, Role.TEACHER, Role.COORDINATOR]
                  : [...roles, Role.TEACHER]
                : roles,
            [Role.REGISTRY]
          ),
        })
    );
  }
}
