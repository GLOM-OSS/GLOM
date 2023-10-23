import { Prisma, PrismaClient } from '@prisma/client';

export type GlomPrismaServiceOptions = {
  seedData?: (prisma: PrismaClient) => void | Promise<void>;
  log_level?: (Prisma.LogLevel | Prisma.LogDefinition)[];
};

export type GlomPrismaModuleOptions = GlomPrismaServiceOptions & {
  isGlobal?: boolean;
};
