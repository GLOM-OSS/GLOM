import { Global, Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../utils/code-generator';
import { AcademicYearService } from '../configurator/academic-year/academic-year.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { LocalStrategy } from './local/local.strategy';

@Global()
@Module({
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    AuthSerializer,
    AcademicYearService,
    CodeGeneratorService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
