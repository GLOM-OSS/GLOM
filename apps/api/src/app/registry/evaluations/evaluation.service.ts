import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SemesterExamAccessPutDto } from '../registry.dto';

@Injectable()
export class EvaluationService {
  constructor(private prismaService: PrismaService) {}

  async getExamAccess(academic_year_id: string) {
    return this.prismaService.annualSemesterExamAcess.findMany({
      select: {
        annual_semester_number: true,
        payment_percentage: true,
      },
      take: 2,
      where: { academic_year_id },
    });
  }

  async updateSemesterExamAccess(
    { semesterExamAccess: newSemesterExamAcess }: SemesterExamAccessPutDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const semesterExamAccess = await this.getExamAccess(academic_year_id);

    return this.prismaService.$transaction([
      ...semesterExamAccess.map((access) =>
        this.prismaService.annualSemesterExamAcess.update({
          data: {
            payment_percentage: newSemesterExamAcess.find(
              (_) => _.annual_sesmeter_number === access.annual_semester_number
            ).payment_percentage,
            AnnualSemesterExamAcessAudits: {
              create: {
                ...access,
                AnnualRegistry: { connect: { annual_registry_id } },
              },
            },
          },
          where: {
            academic_year_id_annual_semester_number: {
              academic_year_id,
              annual_semester_number: access.annual_semester_number,
            },
          },
        })
      ),
    ]);
  }
}
