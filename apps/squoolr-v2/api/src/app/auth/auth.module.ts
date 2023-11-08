import { Global, Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { AcademicYearsService } from '../../modules/academic-years/academic-years.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';

@Global()
@Module({
  providers: [
    AuthService,
    LocalStrategy,
    AuthSerializer,
    CodeGeneratorFactory,
    AcademicYearsService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
