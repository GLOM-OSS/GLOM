import { GlomPrismaService } from '@glom/prisma';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import {
  CreateCoordinatorInput,
  IStaffService,
  StaffSelectParams,
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffEntity } from '../staff.dto';
import { BatchPayloadDto } from '../../modules.dto';

@Injectable()
export class CoordinatorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  async findOne(annual_coordinator_id: string): Promise<StaffEntity> {
    throw new NotImplementedException(
      '`findOne` method is not supported for coordinators. Use teacher instead'
    );
  }

  async findAll(staffParams?: StaffSelectParams) {
    const coordinators =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          AnnualTeacher: {
            select: {
              annual_teacher_id: true,
              Teacher: { select: { matricule: true } },
              ...StaffArgsFactory.getStaffSelect(staffParams),
            },
          },
        },
        where: {
          AnnualTeacher: StaffArgsFactory.getStaffWhereInput(staffParams),
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
          roles: [{ registry }, { configrator }].reduce<StaffRole[]>(
            (roles, _) =>
              _.registry
                ? [...roles, StaffRole.REGISTRY]
                : _.configrator
                ? [...roles, StaffRole.CONFIGURATOR]
                : roles,
            [StaffRole.TEACHER, StaffRole.COORDINATOR]
          ),
        })
    );
  }

  async create(
    { annual_teacher_id, annualClassroomIds }: CreateCoordinatorInput,
    created_by: string
  ) {
    const annualClassroomDivisions =
      await this.prismaService.annualClassroomDivision.findMany({
        select: {
          annual_classroom_division_id: true,
          annual_coordinator_id: true,
          is_deleted: true,
        },
        where: {
          OR: annualClassroomIds.map((annual_classroom_id) => ({
            annual_classroom_id,
          })),
        },
      });
    const [{ count }] = await this.prismaService.$transaction([
      this.prismaService.annualClassroomDivision.updateMany({
        data: {
          annual_coordinator_id: annual_teacher_id,
        },
        where: {
          OR: annualClassroomIds.map((annual_classroom_id) => ({
            annual_classroom_id,
          })),
        },
      }),
      this.prismaService.annualClassroomDivisionAudit.createMany({
        data: annualClassroomDivisions.map((data) => ({
          ...data,
          audited_by: created_by,
        })),
      }),
    ]);
    return new BatchPayloadDto({
      count,
      message: `Updated ${count} records in database`,
    });
  }
}
