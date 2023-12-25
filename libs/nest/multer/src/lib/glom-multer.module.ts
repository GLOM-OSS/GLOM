import { DynamicModule, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GlomMulterOptions } from './glom-multer';
import { GlomMulterService } from './glom-multer.service';

@Module({})
export class GlomMulterModule {
  static register(multerOptions?: GlomMulterOptions): DynamicModule {
    const multerModule = MulterModule.registerAsync({
      useClass: GlomMulterService,
    });
    return {
      ...multerModule,
      global: multerOptions?.isGlobal ?? false,
    };
  }
}
