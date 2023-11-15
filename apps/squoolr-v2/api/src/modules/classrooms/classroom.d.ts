import { Prisma } from '@prisma/client';

export type UpdateClassroomPayload = Partial<
  Pick<
    Prisma.AnnualClassroomUpdateInput,
    'classroom_level' | 'number_of_divisions'
  > & { is_deleted: false }
>;
