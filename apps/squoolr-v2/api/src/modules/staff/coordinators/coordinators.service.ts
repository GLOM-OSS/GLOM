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

@Injectable()
export class CoordinatorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  create: (
    payload: CreateCoordinatorInput,
    created_by: string
  ) => Promise<StaffEntity>;
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
}
