import { Prisma } from '@prisma/client';
import { CycleSettingMeta } from '../cycle-settings';

export type QueryAcademicProfile = CycleSettingMeta & {
  weighting_system: number;
};
