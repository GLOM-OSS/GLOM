import { Logger, Module, Provider } from '@nestjs/common';
import { PrismaService } from './glom-prisma.service';
import { GlomPrismaModuleOptions } from './glom-prisma.type.d';

@Module({})
export class GlomPrismaModule {
  static forRoot({
    global = false,
    log_level = ['query', 'error'],
    seedSync = () => {
      Logger.debug('Nothing to seed !!!', GlomPrismaModule.name);
    },
    seedASync,
  }: GlomPrismaModuleOptions) {
    const prismaProdiver: Provider = {
      provide: PrismaService,
      useValue: new PrismaService({ log_level, seedSync, seedASync }),
    };
    return {
      global,
      module: GlomPrismaModule,
      exports: [prismaProdiver],
      prodiers: [prismaProdiver],
    };
  }
}
