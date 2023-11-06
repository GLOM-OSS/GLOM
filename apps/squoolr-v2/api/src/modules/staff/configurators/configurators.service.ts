import { GlomPrismaService } from '@glom/prisma';
import { ConflictException, Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { CreateStaffInput, IStaffService, StaffSelectParams } from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffRole } from '../../../utils/enums';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class ConfiguratorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_configurator_id: string) {
    const {
      matricule,
      Login: { login_id, Person },
    } = await this.prismaService.annualConfigurator.findFirst({
      select: {
        matricule: true,
        ...StaffArgsFactory.getStaffSelect(),
      },
      where: {
        annual_configurator_id,
        is_deleted: false,
      },
    });
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      roles: [],
      last_connected: null,
      annual_configurator_id,
    });
  }

  async findAll(staffParams?: StaffSelectParams) {
    const configurators = await this.prismaService.annualConfigurator.findMany({
      select: {
        matricule: true,
        annual_configurator_id: true,
        ...StaffArgsFactory.getStaffSelect(staffParams),
      },
      where: {
        is_sudo: !staffParams?.academic_year_id,
        ...StaffArgsFactory.getStaffWhereInput(staffParams),
      },
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
          roles: [{ registry }, { teacher }].reduce<StaffRole[]>(
            (roles, _) =>
              _.registry
                ? [...roles, StaffRole.REGISTRY]
                : _.teacher
                ? _.teacher.AnnualClassroomDivisions
                  ? [...roles, StaffRole.TEACHER, StaffRole.COORDINATOR]
                  : [...roles, StaffRole.TEACHER]
                : roles,
            [StaffRole.CONFIGURATOR]
          ),
        })
    );
  }

  async create(configuratorPayload: CreateStaffInput, created_by: string) {
    const {
      matricule,
      annual_configurator_id,
      Login: { login_id, Person },
    } = await this.prismaService.annualConfigurator.create({
      select: {
        ...StaffArgsFactory.getStaffSelect(),
        annual_configurator_id: true,
        matricule: true,
      },
      data: {
        CreatedByAnnualConfigurator: {
          connect: { annual_configurator_id: created_by },
        },
        ...StaffArgsFactory.getStaffCreateInput(configuratorPayload),
      },
    });
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      roles: [],
      last_connected: null,
      annual_configurator_id,
    });
  }
}