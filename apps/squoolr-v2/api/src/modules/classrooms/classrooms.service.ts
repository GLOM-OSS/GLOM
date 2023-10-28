import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  AnnualClassroomEntity,
  QueryClassroomDto,
  UpdateClassroomDto,
} from './classroom.dto';
import { UpdateClassroomPayload } from './classroom';

@Injectable()
export class ClassroomsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(annual_major_id: string, params?: QueryClassroomDto) {
    const classrooms = await this.prismaService.annualClassroom.findMany({
      include: {
        Classroom: { select: { level: true } },
        AnnualClassroomDivisions: { select: { annual_coordinator_id: true } },
      },
      where: {
        annual_major_id,
        OR: [
          {
            is_deleted: params?.is_deleted,
            Classroom: params?.level ? { level: params.level } : undefined,
          },
          {
            classroom_name: {
              search: params?.keywords,
            },
          },
        ],
      },
    });
    return classrooms.map(
      ({
        Classroom: { level },
        AnnualClassroomDivisions: [{ annual_coordinator_id }],
        ...data
      }) =>
        new AnnualClassroomEntity({
          ...data,
          annual_coordinator_id,
          classroom_level: level,
          number_of_divisions: 1,
        })
    );
  }

  async update(
    annual_classroom_id: string,
    payload: UpdateClassroomPayload,
    audited_by: string
  ) {
    const annualClassroomAudit =
      await this.prismaService.annualClassroom.findUnique({
        select: {
          registration_fee: true,
          total_fee_due: true,
          is_deleted: true,
        },
        where: { annual_classroom_id },
      });
    await this.prismaService.annualClassroom.update({
      data: {
        ...payload,
        AnnualClassroomAudits: {
          create: {
            audited_by,
            ...annualClassroomAudit,
          },
        },
      },
      where: { annual_classroom_id },
    });
  }
}
