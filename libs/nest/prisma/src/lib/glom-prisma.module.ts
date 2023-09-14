import { Logger, Module, Provider } from '@nestjs/common';
import { GlomPrismaService } from './glom-prisma.service';
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
      provide: GlomPrismaService,
      useValue: new GlomPrismaService({ log_level, seedSync, seedASync }),
    };
    return {
      global,
      module: GlomPrismaModule,
      exports: [prismaProdiver],
      providers: [prismaProdiver],
    };
  }
}
