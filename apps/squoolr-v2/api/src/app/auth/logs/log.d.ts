import { Prisma } from '@prisma/client';

export type LogCreateInput = Omit<
  Prisma.LogCreateManyInput,
  'closed_at' | 'logged_in_at' | 'logged_out_at'
>;

export type LogUpdateInput = Pick<
  Prisma.LogCreateInput,
  'closed_at' | 'logged_out_at' | 'updated_at'
>;

export type LogWhereInput = Required<
  Pick<Prisma.LogWhereInput, 'closed_at' | 'logged_out_at'>
>;
