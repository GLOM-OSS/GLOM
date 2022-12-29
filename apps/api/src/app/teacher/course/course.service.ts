import { PrismaService } from '../../../prisma/prisma.service';

export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async findAll(annual_teacher_id: string) {
    return this.prismaService.annualCreditUnitSubject.findMany({
      select: {
        annual_credit_unit_subject_id: true,
        subject_title: true,
        subject_code: true,
        AnnualCreditUnit: { select: { semester_number: true } },
      },
      where: { AnnualTeacher: { annual_teacher_id } },
    });
  }
}
