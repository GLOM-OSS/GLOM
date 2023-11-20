import { Prisma } from '@prisma/client';

export type CycleSettingMeta = {
  academic_year_id: string;
  cycle_id: string;
};

export type ExamAccessSettingInput = Pick<
  Prisma.AnnualSemesterExamAcessCreateInput,
  'annual_semester_number' | 'payment_percentage'
>;

export type EvaluationTypeInput = Pick<
  Prisma.AnnualEvaluationTypeCreateInput,
  'evaluation_type' | 'evaluation_type_weight'
>;

export type ModuleSettingInput = Pick<
  Prisma.AnnualModuleSettingCreateInput,
  'carry_over_system' | 'minimum_modulation_score'
>;
