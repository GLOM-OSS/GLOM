import { Prisma } from '@prisma/client';

export type GenerateClassroomsPayload = {
  annual_major_id: string;
  major_name: string;
  major_acronym: string;
  number_of_years: number;
};

export type CreateMajorPayload = Pick<
  Prisma.AnnualMajorCreateManyInput,
  'academic_year_id' | 'department_id' | 'major_acronym' | 'major_name'
> & { cycle_id: string };

export type UpdateMajorPayload = Pick<
  Prisma.AnnualMajorUpdateInput,
  'major_name' | 'major_acronym'
> & { is_deleted?: true };
