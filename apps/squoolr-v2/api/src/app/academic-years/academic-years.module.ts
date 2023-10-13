import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
// import { AuthService } from '../auth/auth.service';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearsController } from './acdemic-years.controller';

@Module({
  providers: [
    // AuthService,
    AcademicYearsService,
    CodeGeneratorFactory,
  ],
  controllers: [AcademicYearsController],
})
export class AcademicYearsModule {}
