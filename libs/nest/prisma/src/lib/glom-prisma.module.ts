import { Logger, Module, Provider } from '@nestjs/common';
import { GlomPrismaService } from './glom-prisma.service';
import { GlomPrismaModuleOptions } from './glom-prisma.type.d';

@Module({})
export class GlomPrismaModule {
  static forRoot(glomPrismaOptions?: GlomPrismaModuleOptions) {
    const { global, ...options } = glomPrismaOptions;
    const providers: Provider[] = [];
    if (glomPrismaOptions) {
      const prismaProdiver: Provider = {
        provide: GlomPrismaService,
        useValue: new GlomPrismaService(options),
      };
      providers.push(prismaProdiver);
    }
    return {
      global,
      exports: providers,
      providers: providers,
      module: GlomPrismaModule,
    };
  }
}
