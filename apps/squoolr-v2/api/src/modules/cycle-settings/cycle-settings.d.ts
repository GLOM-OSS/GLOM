import { Prisma } from '@prisma/client';

export type CycleSettingMeta = {
  academic_year_id: string;
  cycle_id: string;
};

export type ExamAccessSettingInput = Pick<
  Prisma.AnnualSemesterExamAcessCreateManyInput,
  'annual_semester_number' | 'payment_percentage'
>;

export type EvaluationTypeInput = Pick<
  Prisma.AnnualEvaluationTypeCreateManyInput,
  'evaluation_type' | 'evaluation_type_weight'
>;
