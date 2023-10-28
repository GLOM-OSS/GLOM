import { Prisma } from '@prisma/client';

export type CreateDepartmentPayload = Pick<
  Prisma.DepartmentCreateManyInput,
  'department_acronym' | 'department_name' | 'school_id'
>;

export type UpdateDepartmentPayload = Partial<
  Omit<CreateDepartmentPayload, 'school_id'> & {
    is_deleted: true;
  }
>;
