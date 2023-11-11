import { Prisma } from '@prisma/client';

export type UpdateClassroomPayload = Partial<
  Pick<
    Prisma.AnnualClassroomUpdateInput,
    'total_fee_due' | 'registration_fee'
  > & { is_deleted: true }
>;
