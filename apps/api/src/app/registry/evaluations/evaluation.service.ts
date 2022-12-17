import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prismaService: PrismaService) {}

  async getExamAccess(academic_year_id: string) {
    return this.prismaService.annualSemesterExamAcess.findMany({
      select: {
        annual_semester_exam_access_id: true,
        annual_semester_number: true,
        payment_percentage: true,
      },
      take: 2,
      where: { academic_year_id },
    });
  }
}
