import { GlomPrismaService } from '@glom/prisma';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { QueryParamsDto } from '../../modules.dto';
import { CreateStaffInput, IStaffService } from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { StaffRole } from '../../../utils/enums';
import { StaffEntity } from '../staff.dto';

@Injectable()
export class CoordinatorsService implements IStaffService<StaffEntity> {
  constructor(private prismaService: GlomPrismaService) {}
  create: (
    payload: CreateStaffInput,
    created_by: string
  ) => Promise<StaffEntity>;
  async findOne(annual_coordinator_id: string): Promise<StaffEntity> {
    throw new NotImplementedException(
      '`findOne` method is not supported for coordinators. Use teacher instead'
    );
  }

  async findAll(academic_year_id: string, params?: QueryParamsDto) {
    const coordinators =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          AnnualTeacher: {
            select: {
              annual_teacher_id: true,
              Teacher: { select: { matricule: true } },
              ...StaffArgsFactory.getStaffSelect({
                activeRole: StaffRole.COORDINATOR,
                academic_year_id,
                params,
              }),
            },
          },
        },
        where: {
          AnnualTeacher: StaffArgsFactory.getStaffWhereInput(
            academic_year_id,
            params
          ),
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
