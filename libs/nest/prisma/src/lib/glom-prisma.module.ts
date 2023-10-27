import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { GlomPrismaService } from './glom-prisma.service';
import { GlomPrismaModuleOptions } from './glom-prisma.type.d';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';

@Module({})
export class GlomPrismaModule {
  static forRoot(
    glomPrismaOptions: GlomPrismaModuleOptions = { isGlobal: false }
  ): DynamicModule {
    const { isGlobal, ...options } = glomPrismaOptions;
    const providers: Provider[] = [
      {
        provide: GlomPrismaService,
        useValue: new GlomPrismaService(options),
      },
      {
        provide: APP_FILTER,
        useClass: PrismaClientExceptionFilter,
      },
    ];
    return {
      global: isGlobal,
      providers: providers,
      module: GlomPrismaModule,
      exports: providers.slice(0, providers.length - 1),
    };
  }
}
