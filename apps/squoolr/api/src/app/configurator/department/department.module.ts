import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  providers: [CodeGeneratorService, DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
