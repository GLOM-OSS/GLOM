import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { StaffEntity } from '../staff.dto';
import { IStaffService } from '../staff';
import { QueryParams } from '../../module';
import { Role } from '../../../app/auth/auth.decorator';
import { StaffArgsFactory } from '../staff-args.factory';

@Injectable()
export class ConfiguratorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  findOne: (
    annual_personnel_id: string,
    params?: QueryParams
  ) => Promise<StaffEntity>;

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const configurators = await this.prismaService.annualConfigurator.findMany({
      select: {
        matricule: true,
        annual_configurator_id: true,
        ...StaffArgsFactory.getStaffSelect({
          activeRole: Role.CONFIGURATOR,
          academic_year_id,
          params,
        }),
      },
      where: StaffArgsFactory.getStaffWhereInput(academic_year_id, params),
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

  // async findOne(annual_registry_id: string, params?: QueryParams) {
  //   const {
  //     matricule,
  //     Login: { login_id, Person: person },
  //   } = await this.prismaService.annualRegistry.findFirst({
  //     select: {
  //       matricule: true,
  //       ...StaffArgsFactory.getStaffSelect({ params }),
  //     },
  //     where: { annual_registry_id, is_deleted: false },
  //   });
  //   return {
  //     login_id,
  //     ...person,
  //     matricule,
  //     annual_registry_id,
  //   };
  // }
}
