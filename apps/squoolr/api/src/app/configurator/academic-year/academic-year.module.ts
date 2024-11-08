import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearController } from './acdemic-year.controller';

@Module({
  providers: [AcademicYearService, CodeGeneratorService],
  controllers: [AcademicYearController],
})
export class AcademicYearModule {}
