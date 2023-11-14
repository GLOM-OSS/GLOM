import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import {
  CreateStaffInput,
  IStaffService,
  StaffCreateFromInput,
  StaffSelectParams,
  UpdateStaffInput,
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class RegistriesService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_registry_id: string) {
    const {
      matricule,
      is_deleted,
      Login: { login_id, Person },
    } = await this.prismaService.annualRegistry.findFirstOrThrow({
      select: {
        matricule: true,
        ...StaffArgsFactory.getStaffSelect(),
      },
      where: { annual_registry_id, is_deleted: false },
    });
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      roles: [],
      is_deleted,
      last_connected: null,
      annual_registry_id,
      role: StaffRole.REGISTRY,
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
        matricule,
        is_deleted,
        annual_registry_id,
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
          is_deleted,
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
          role: StaffRole.REGISTRY,
        })
    );
  }

  async create(payload: CreateStaffInput, created_by: string) {
    const {
      matricule,
      is_deleted,
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
        CreatedBy: {
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
      is_deleted,
      annual_registry_id,
      last_connected: null,
      role: StaffRole.REGISTRY,
    });
  }

  async update(
    annual_registry_id: string,
    payload: UpdateStaffInput,
    audited_by: string
  ) {
    const {
      is_deleted,
      private_code,
      Login: { Person: person },
    } = await this.prismaService.annualRegistry.findUniqueOrThrow({
      select: {
        private_code: true,
        ...StaffArgsFactory.getStaffSelect(),
      },
      where: { annual_registry_id },
    });
    const isDeleted = payload.delete ? !is_deleted : undefined;
    await this.prismaService.annualRegistry.update({
      data: {
        is_deleted: isDeleted,
        AnnualRegistryAudits: {
          create: {
            is_deleted,
            private_code,
            AnnualConfigurator: {
              connect: { annual_configurator_id: audited_by },
            },
          },
        },
        Login:
          isDeleted !== undefined
            ? undefined
            : {
                update: {
                  Person: {
                    update: {
                      ...payload,
                      PersonAudits: { create: { ...person, audited_by } },
                    },
                  },
                },
              },
      },
      where: { annual_registry_id },
    });
  }

  async createFrom(
    login_id: string,
    { matricule, academic_year_id, private_code }: StaffCreateFromInput,
    created_by: string
  ) {
    const {
      is_deleted,
      annual_registry_id,
      Login: { Person },
    } = await this.prismaService.annualRegistry.upsert({
      select: {
        annual_registry_id: true,
        ...StaffArgsFactory.getStaffSelect(),
      },
      create: {
        matricule,
        private_code,
        Login: { connect: { login_id } },
        AcademicYear: { connect: { academic_year_id } },
        CreatedBy: {
          connect: { annual_configurator_id: created_by },
        },
      },
      update: { is_deleted: false },
      where: { login_id_academic_year_id: { academic_year_id, login_id } },
    });
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      roles: [],
      is_deleted,
      last_connected: null,
      annual_registry_id,
      role: StaffRole.REGISTRY,
    });
  }

  async resetPrivateCodes(
    annualStaffIds: string[],
    codes: string[],
    reset_by: string
  ) {
    const configurators = await this.prismaService.annualRegistry.findMany({
      where: {
        OR: annualStaffIds.map((annual_registry_id) => ({
          annual_registry_id,
        })),
      },
    });
    await this.prismaService.$transaction([
      ...configurators.map(
        ({ annual_registry_id, is_deleted, private_code }, i) =>
          this.prismaService.annualRegistry.update({
            data: {
              private_code: codes[i],
              AnnualRegistryAudits: {
                create: {
                  is_deleted,
                  private_code,
                  AnnualConfigurator: {
                    connect: { annual_configurator_id: reset_by },
                  },
                },
              },
            },
            where: { annual_registry_id },
          })
      ),
    ]);
  }
}
