import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import { BatchPayload } from '../../module';
import {
  CreateStaffInput,
  IStaffService,
  StaffSelectParams,
  UpdateStaffInput,
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class ConfiguratorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  update(payload: UpdateStaffInput): Promise<BatchPayload> {
    throw new Error('Method not implemented.');
  }
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
          Teacher,
          Logs: [log],
          AnnualRegistries: [registry],
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          annual_configurator_id,
          last_connected: log?.logged_in_at ?? null,
          roles: [{ registry }, { teacher: Teacher?.AnnualTeachers }].reduce<
            StaffRole[]
          >(
            (roles, _) =>
              _.registry
                ? [...roles, StaffRole.REGISTRY]
                : _.teacher
                ? _.teacher[0].AnnualClassroomDivisions
                  ? [...roles, StaffRole.TEACHER, StaffRole.COORDINATOR]
                  : [...roles, StaffRole.TEACHER]
                : roles,
            [StaffRole.CONFIGURATOR]
          ),
        })
    );
  }

  async create(payload: CreateStaffInput, created_by: string) {
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
        matricule: payload.matricule,
        CreatedByAnnualConfigurator: {
          connect: { annual_configurator_id: created_by },
        },
        ...StaffArgsFactory.getStaffCreateInput(payload),
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
