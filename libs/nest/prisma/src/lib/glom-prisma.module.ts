import { Logger, Module, Provider } from '@nestjs/common';
import { GlomPrismaService } from './glom-prisma.service';
import { GlomPrismaModuleOptions } from './glom-prisma.type.d';

@Module({})
export class GlomPrismaModule {
  static forRoot(
    glomPrismaOptions: GlomPrismaModuleOptions = { isGlobal: false }
  ) {
    const { isGlobal, ...options } = glomPrismaOptions;
    const providers: Provider[] = [
      {
        provide: GlomPrismaService,
        useValue: new GlomPrismaService(options),
      },
    ];
    return {
      global: isGlobal,
      exports: providers,
      providers: providers,
      module: GlomPrismaModule,
    };
  }
}
