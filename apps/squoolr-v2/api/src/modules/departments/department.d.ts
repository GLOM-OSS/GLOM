import { Prisma } from '@prisma/client';

export type DepartmentCreateInput = Pick<
  Prisma.DepartmentCreateManyInput,
  'department_acronym' | 'department_name' | 'school_id'
>;
