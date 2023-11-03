import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { IStaffService } from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffRole } from '../../../utils/enums';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class RegistriesService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_registry_id: string) {
    const {
      matricule,
      Login: { login_id, Person },
    } = await this.prismaService.annualRegistry.findUniqueOrThrow({
      select: {
        matricule: true,
        ...StaffArgsFactory.getStaffSelect(),
      },
      where: { annual_registry_id },
    });
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      roles: [],
      last_connected: null,
      annual_registry_id,
    });
  }

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const registries = await this.prismaService.annualRegistry.findMany({
      select: {
        matricule: true,
        annual_registry_id: true,
        ...StaffArgsFactory.getStaffSelect({
          activeRole: StaffRole.COORDINATOR,
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
          roles: [{ configrator }, { teacher }].reduce<StaffRole[]>(
            (roles, _) =>
              _.configrator
                ? [...roles, StaffRole.CONFIGURATOR]
                : _.teacher
                ? _.teacher.AnnualClassroomDivisions
                  ? [...roles, StaffRole.TEACHER, StaffRole.COORDINATOR]
                  : [...roles, StaffRole.TEACHER]
                : roles,
            [StaffRole.REGISTRY]
          ),
        })
    );
  }
}
