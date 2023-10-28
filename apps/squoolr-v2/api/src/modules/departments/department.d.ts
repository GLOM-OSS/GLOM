import { Prisma } from '@prisma/client';

export type CreateDepartmentInput = Pick<
  Prisma.DepartmentCreateManyInput,
  'department_acronym' | 'department_name' | 'school_id'
>;

export type UpdateDepartmentInput = Partial<
  Omit<CreateDepartmentInput, 'school_id'> & {
    is_deleted: true;
  }
>;
