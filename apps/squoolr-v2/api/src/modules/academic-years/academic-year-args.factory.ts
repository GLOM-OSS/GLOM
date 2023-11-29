import { EvaluationTypeEnum, Prisma } from '@prisma/client';

export class AcademicYearArgsFactory {
  static getInitialSetup(
    annual_configurator_id: string
  ): Omit<
    Prisma.AcademicYearCreateWithoutSchoolInput,
    'year_code' | 'starts_at' | 'ends_at'
  > {
    return {
      AnnualSchoolSetting: {
        create: {
          mark_insertion_source: 'Teacher',
          CreatedBy: { connect: { annual_configurator_id } },
        },
      },
    };
  }
}
