import { Prisma } from '@prisma/client';

export type CreateCourseModuleInput = Pick<
  Prisma.AnnualModuleCreateManyInput,
  | 'academic_year_id'
  | 'credit_points'
  | 'module_name'
  | 'semester_number'
  | 'annual_classroom_id'
> & { module_code: string; school_id: string };
