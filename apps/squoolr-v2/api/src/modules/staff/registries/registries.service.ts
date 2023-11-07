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
export class RegistriesService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  update(payload: UpdateStaffInput): Promise<BatchPayload> {
    throw new Error('Method not implemented.');
  }
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

  async findAll(staffParams?: StaffSelectParams) {
    const registries = await this.prismaService.annualRegistry.findMany({
      select: {
        matricule: true,
        annual_registry_id: true,
        ...StaffArgsFactory.getStaffSelect(staffParams),
      },
      where: StaffArgsFactory.getStaffWhereInput(staffParams),
    });
    return registries.map(
      ({
        annual_registry_id,
        matricule,
        Login: {
          login_id,
          Person,
          Teacher,
          Logs: [log],
          AnnualConfigurators: [configrator],
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          annual_registry_id,
          last_connected: log?.logged_in_at ?? null,
          roles: [{ configrator }, { teacher: Teacher?.AnnualTeachers }].reduce<
            StaffRole[]
          >(
            (roles, _) =>
              _.configrator
                ? [...roles, StaffRole.CONFIGURATOR]
                : _.teacher
                ? _.teacher[0].AnnualClassroomDivisions
                  ? [...roles, StaffRole.TEACHER, StaffRole.COORDINATOR]
                  : [...roles, StaffRole.TEACHER]
                : roles,
            [StaffRole.REGISTRY]
          ),
        })
    );
  }

  async create(payload: CreateStaffInput, created_by: string) {
    const {
      matricule,
      annual_registry_id,
      Login: { login_id, Person },
    } = await this.prismaService.annualRegistry.create({
      select: {
        ...StaffArgsFactory.getStaffSelect(),
        annual_registry_id: true,
        matricule: true,
      },
      data: {
        matricule: payload.matricule,
        private_code: payload.private_code,
        AnnualConfigurator: {
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
      annual_registry_id,
      last_connected: null,
    });
  }
}
