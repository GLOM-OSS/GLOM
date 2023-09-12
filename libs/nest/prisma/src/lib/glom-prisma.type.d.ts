import { Prisma } from '@prisma/client';

export type GlomPrismaServiceOptions = {
  seedSync: () => void;
  seedASync?: () => Promise<void>;
  log_level: (Prisma.LogLevel | Prisma.LogDefinition)[];
};

export type GlomPrismaModuleOptions = Partial<
  GlomPrismaServiceOptions & {
    global: boolean;
  }
>;
