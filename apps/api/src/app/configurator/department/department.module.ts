import { Module } from '@nestjs/common';
import { CodeGeneratorService } from 'apps/api/src/utils/code-generator';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  providers: [CodeGeneratorService, DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
