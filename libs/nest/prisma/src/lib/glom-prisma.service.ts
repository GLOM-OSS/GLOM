import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { GlomPrismaServiceOptions } from './glom-prisma.type.d';

@Injectable()
export class GlomPrismaService extends PrismaClient implements OnModuleInit {
  constructor(prismaConfig: GlomPrismaServiceOptions) {
    const { log_level, seedASync, seedSync } = prismaConfig;
    super({ log: log_level });
    (seedASync ?? seedSync)();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
