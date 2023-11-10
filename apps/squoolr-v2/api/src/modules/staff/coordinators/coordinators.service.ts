import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys } from '@glom/utils';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { StaffRole } from '../../../utils/enums';
import { BatchPayloadDto } from '../../modules.dto';
import {
  CreateCoordinatorInput,
  IStaffService,
  StaffCreateFromInput,
  StaffSelectParams,
  UpdateCoordinatorInput
} from '../staff';
import { StaffArgsFactory } from '../staff-args.factory';
import { CoordinatorEntity, StaffEntity } from '../staff.dto';

@Injectable()
export class CoordinatorsService
  implements IStaffService<StaffEntity | CoordinatorEntity>
{
  constructor(private prismaService: GlomPrismaService) {}
  createFrom(
    login_id: string,
    payload: StaffCreateFromInput,
    created_by: string
  ): Promise<CoordinatorEntity> {
    throw new NotImplementedException(
      '`createFrom` method is not supported for coordinators. Use teacher instead'
    );
  }
  async findOne(annual_coordinator_id: string) {
    const coordinatedClasses =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          annual_classroom_id: true,
          AnnualTeacher: {
            select: StaffArgsFactory.getTeacherSelect(),
          },
        },
        where: { annual_coordinator_id },
      });
    if (coordinatedClasses.length === 0)
      throw new NotFoundException('Coordinated classrooms not found !!!');
    return coordinatedClasses.reduce<CoordinatorEntity>(
      (
        coordo,
        {
          annual_classroom_id,
          AnnualTeacher: {
            Teacher: {
              Login: {
                login_id,
                Person,
                Logs: [log],
                AnnualConfigurators: [configrator],
                AnnualRegistries: [registry],
              },
              ...teacher
            },
            ...annual_teacher
          },
        }
      ) =>
        new CoordinatorEntity(
          coordo
            ? {
                ...coordo,
                annualClassroomIds: coordo.annualClassroomIds.includes(
                  annual_classroom_id
                )
                  ? coordo.annualClassroomIds
                  : [...coordo.annualClassroomIds, annual_classroom_id],
              }
            : {
                login_id,
                ...Person,
                ...teacher,
                ...annual_teacher,
                last_connected: log?.logged_in_at ?? null,
                annualClassroomIds: [annual_classroom_id],
                roles: [{ registry }, { configrator }].reduce<StaffRole[]>(
                  (roles, _) =>
                    _.registry
                      ? [...roles, StaffRole.REGISTRY]
                      : _.configrator
                      ? [...roles, StaffRole.CONFIGURATOR]
                      : roles,
                  [StaffRole.TEACHER, StaffRole.COORDINATOR]
                ),
                role: StaffRole.COORDINATOR,
              }
        ),
      CoordinatorEntity.prototype
    );
  }

  async findAll(staffParams?: StaffSelectParams) {
    const coordinators =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          AnnualTeacher: {
            select: StaffArgsFactory.getTeacherSelect(),
          },
        },
        where: {
          is_deleted: false,
          AnnualTeacher: StaffArgsFactory.getStaffWhereInput(staffParams),
        },
      });
    return coordinators.map(
      ({
        AnnualTeacher: {
          Teacher: {
            matricule,
            is_deleted,
            Login: {
              login_id,
              Person,
              Logs: [log],
              AnnualConfigurators: [configrator],
              AnnualRegistries: [registry],
            },
          },
          annual_teacher_id,
        },
      }) =>
        new StaffEntity({
          login_id,
          ...Person,
          matricule,
          is_deleted,
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
          role: StaffRole.COORDINATOR,
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

  async update(
    annual_coordinator_id: string,
    { annualClassroomIds }: UpdateCoordinatorInput,
    audited_by: string
  ) {
    const coordinatedClasses =
      await this.prismaService.annualClassroomDivision.findMany({
        where: { annual_coordinator_id },
      });
    const addedClasses = annualClassroomIds.filter(
      (id) =>
        !coordinatedClasses.find(
          ({ annual_classroom_id }) => id === annual_classroom_id
        )
    );
    const deletedClasses = coordinatedClasses.filter(
      ({ annual_classroom_id }) =>
        !annualClassroomIds.find((id) => id === annual_classroom_id)
    );
    await this.prismaService.$transaction([
      this.prismaService.annualClassroomDivision.updateMany({
        data: {
          annual_coordinator_id,
        },
        where: {
          OR: addedClasses.map((annual_classroom_id) => ({
            annual_classroom_id,
          })),
        },
      }),
      this.prismaService.annualClassroomDivision.updateMany({
        data: { is_deleted: true },
        where: {
          OR: deletedClasses.map(({ annual_classroom_id }) => ({
            annual_classroom_id,
          })),
        },
      }),
      this.prismaService.annualClassroomDivisionAudit.createMany({
        data: deletedClasses.map((deletedClass) => ({
          audited_by,
          ...excludeKeys(deletedClass, ['created_by', 'created_at']),
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
