import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ClassroomPutDto, ClassroomQueryDto } from '../configurator.dto';

@Injectable()
export class ClassroomService {
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;

  constructor(private prismaService: PrismaService) {
    this.annualClassroomService = prismaService.annualClassroom;
    this.annualClassroomDivisionService = prismaService.annualClassroomDivision;
  }

  async findAll({
    academic_year_id,
    level,
    major_code,
    ...where
  }: ClassroomQueryDto) {
    const classrooms = await this.annualClassroomService.findMany({
      select: {
        classroom_code: true,
        classroom_name: true,
        classroom_acronym: true,
        registration_fee: true,
        total_fee_due: true,
        Classroom: {
          select: {
            level: true,
          },
        },
      },
      where: {
        ...where,
        Classroom: {
          level,
          Major: { major_code },
        },
        academic_year_id,
      },
    });
    return classrooms.map(({ Classroom: { level }, ...data }) => ({
      classroom_level: level,
      ...data,
    }));
  }

  async findDivisions(annual_classroom_id: string) {
    return this.annualClassroomDivisionService.findMany({
      where: {
        annual_classroom_id,
      },
    });
  }

  async editClassroom(
    classroom_code: string,
    { registration_fee, total_fee_due }: ClassroomPutDto,
    academic_year_id: string,
    audited_by: string
  ) {
    const annualClassroomAudit = await this.annualClassroomService.findUnique({
      select: {
        registration_fee: true,
        total_fee_due: true,
        is_deleted: true,
      },
      where: {
        classroom_code_academic_year_id: {
          academic_year_id,
          classroom_code,
        },
      },
    });
    return this.annualClassroomService.update({
      data: {
        registration_fee,
        total_fee_due,
        AnnualClassroomAudits: {
          create: {
            audited_by,
            ...annualClassroomAudit,
          },
        },
      },
      where: {
        classroom_code_academic_year_id: { academic_year_id, classroom_code },
      },
    });
  }
}
