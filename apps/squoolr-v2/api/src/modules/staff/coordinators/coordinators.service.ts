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
  UpdateCoordinatorInput,
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
  async resetPrivateCodes(
    annualStaffIds: string[],
    roles: string[],
    reset_by: string
  ): Promise<void> {
    throw new NotImplementedException(
      '`resetPrivateCodes` method is not supported for coordinators. Use teacher instead'
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
    const [
      {
        annual_classroom_id,
        AnnualTeacher: {
          Teacher: { Login, is_deleted, matricule, ...teacher },
          ...annualTeacher
        },
      },
      ...otherClassess
    ] = coordinatedClasses;
    return new CoordinatorEntity({
      ...teacher,
      ...annualTeacher,
      ...StaffArgsFactory.getStaffEntity({
        Login,
        is_deleted,
        matricule,
      }),
      annualClassroomIds: [
        annual_classroom_id,
        ...(otherClassess ?? []).map((_) => _.annual_classroom_id),
      ],
      role: StaffRole.COORDINATOR,
    });
  }

  async findAll(staffParams?: StaffSelectParams) {
    const teacherSelect = StaffArgsFactory.getStaffSelect(staffParams);
    const { academic_year_id, is_deleted, ...teacherWhereInput } =
      StaffArgsFactory.getStaffWhereInput(staffParams);
    const coordinators =
      await this.prismaService.annualClassroomDivision.findMany({
        distinct: ['annual_coordinator_id'],
        select: {
          AnnualTeacher: {
            select: {
              is_deleted: true,
              Teacher: { select: excludeKeys(teacherSelect, ['is_deleted']) },
            },
          },
        },
        where: {
          is_deleted: false,
          AnnualTeacher: {
            academic_year_id,
            is_deleted,
            Teacher: teacherWhereInput,
          },
        },
      });
    return coordinators.map(
      ({ AnnualTeacher: { is_deleted, Teacher: teacher } }) =>
        StaffArgsFactory.getStaffEntity({ is_deleted, ...teacher })
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
