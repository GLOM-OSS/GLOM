import { Prisma, PrismaClient } from '@prisma/client';

export type GlomPrismaServiceOptions = {
  seedSync?: (prisma: PrismaClient) => void;
  seedASync?: (prisma: PrismaClient) => Promise<void>;
  log_level?: (Prisma.LogLevel | Prisma.LogDefinition)[];
};

export type GlomPrismaModuleOptions = GlomPrismaServiceOptions & {
  isGlobal?: boolean;
};
