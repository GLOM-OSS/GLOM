import { Module } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { AcademicYearsController } from './acdemic-years.controller';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory'

@Module({
  providers: [AcademicYearsService, CodeGeneratorFactory],
  controllers: [AcademicYearsController],
})
export class AcademicYearsModule {}
