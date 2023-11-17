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
      AnnualEvaluationSubTypes: {
        createMany: {
          data: [
            {
              evaluation_sub_type_name: 'CA',
              evaluation_type: EvaluationTypeEnum.CA,
              evaluation_sub_type_weight: 100,
              created_by: annual_configurator_id,
            },
            {
              evaluation_sub_type_name: 'EXAM',
              evaluation_type: EvaluationTypeEnum.EXAM,
              evaluation_sub_type_weight: 100,
              created_by: annual_configurator_id,
            },
            {
              evaluation_sub_type_name: 'RESIT',
              evaluation_type: EvaluationTypeEnum.EXAM,
              evaluation_sub_type_weight: 100,
              created_by: annual_configurator_id,
            },
          ],
        },
      },
    };
  }
}
