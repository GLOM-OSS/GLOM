import { Prisma } from '@prisma/client';

export type ExamAccessSettingInput = Pick<
  Prisma.AnnualSemesterExamAcessCreateManyInput,
  'annual_semester_number' | 'payment_percentage'
>;

export type CycleSettingMeta = {
  academic_year_id: string;
  cycle_id: string;
};
