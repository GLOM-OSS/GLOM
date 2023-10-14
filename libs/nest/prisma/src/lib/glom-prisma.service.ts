import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { GlomPrismaServiceOptions } from './glom-prisma.type.d';
import { GlomPrismaModule } from './glom-prisma.module';

@Injectable()
export class GlomPrismaService extends PrismaClient implements OnModuleInit {
  constructor({
    log_level = ['query', 'error'],
    seedData = () => {
      Logger.debug('Nothing to seed !!!', GlomPrismaModule.name);
    },
  }: GlomPrismaServiceOptions) {
    super({ log: log_level });
    seedData(this);
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
