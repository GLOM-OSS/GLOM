import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';

@Module({
  providers: [CodeGeneratorFactory, DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
