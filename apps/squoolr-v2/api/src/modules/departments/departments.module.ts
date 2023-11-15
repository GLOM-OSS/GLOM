import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { MajorsService } from '../majors/majors.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
  providers: [CodeGeneratorFactory, DepartmentsService, MajorsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
