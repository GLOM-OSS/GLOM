import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ClassroomPutDto, ClassroomQueryDto } from '../configurator.dto';

@Injectable()
export class ClassroomService {
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  constructor(private prismaService: PrismaService) {
    this.annualClassroomService = prismaService.annualClassroom;
  }

  async findAll(
    academic_year_id: string,
    { level, ...where }: ClassroomQueryDto
  ) {
    return this.annualClassroomService.findMany({
      where: {
        ...where,
        Classroom: {
          Level: { level },
        },
        academic_year_id,
      },
    });
  }

  async editClassroom(
    classroom_code: string,
    { registration_fee, total_fees_due }: ClassroomPutDto,
    academic_year_id: string,
    audited_by: string
  ) {
    const annualClassroomAudit = await this.annualClassroomService.findUnique({
      select: {
        registration_fee: true,
        total_fees_due: true,
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
        total_fees_due,
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
