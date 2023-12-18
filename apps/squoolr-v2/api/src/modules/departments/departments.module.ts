import { Module } from '@nestjs/common';
import { MajorsService } from '../majors/majors.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
  providers: [DepartmentsService, MajorsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
