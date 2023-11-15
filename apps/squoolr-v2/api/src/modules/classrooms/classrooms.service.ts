import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { UpdateClassroomPayload } from './classroom';
import { AnnualClassroomEntity, QueryClassroomDto } from './classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(annual_major_id: string, params?: QueryClassroomDto) {
    const classrooms = await this.prismaService.annualClassroom.findMany({
      include: {
        AnnualMajor: { select: { major_acronym: true, major_name: true } },
        AnnualClassroomDivisions: { select: { annual_coordinator_id: true } },
      },
      where: {
        annual_major_id,
        OR: [
          {
            is_deleted: params?.is_deleted,
            classroom_level: params?.level,
          },
          {
            AnnualMajor: params?.keywords
              ? {
                  major_name: {
                    search: params?.keywords,
                  },
                }
              : undefined,
          },
        ],
      },
    });
    return classrooms.map(
      ({
        classroom_level,
        AnnualMajor: { major_acronym, major_name },
        AnnualClassroomDivisions: [{ annual_coordinator_id }],
        ...classroomData
      }) =>
        new AnnualClassroomEntity({
          classroom_level,
          annual_major_id,
          annual_coordinator_id,
          classroom_name: `${major_name} ${classroom_level}`,
          classroom_acronym: `${major_acronym}${classroom_level}`,
          ...classroomData,
        })
    );
  }

  async update(
    annual_classroom_id: string,
    payload: UpdateClassroomPayload,
    audited_by: string
  ) {
    const annualClassroomAudit =
      await this.prismaService.annualClassroom.findFirstOrThrow({
        select: {
          is_deleted: true,
          classroom_level: true,
          number_of_divisions: true,
        },
        where: { annual_classroom_id, is_deleted: false },
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

  async disableMany(annualClassroomIds: string[], disabled_by: string) {
    await Promise.all(
      annualClassroomIds.map((annualClassroomId) =>
        this.update(annualClassroomId, { is_deleted: true }, disabled_by)
      )
    );
  }
}
