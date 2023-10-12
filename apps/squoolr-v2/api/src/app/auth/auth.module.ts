import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { AcademicYearsService } from '../academic-years/academic-years.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    AuthSerializer,
    CodeGeneratorFactory,
    AcademicYearsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
