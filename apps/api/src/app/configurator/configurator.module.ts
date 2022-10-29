import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../utils/code-generator';
import { ClassroomModule } from './classroom/classroom.module';
import { DepartmentModule } from './department/department.module';
import { MajorModule } from './major/major.module';
import { PersonnelModule } from './personnel/personnel.module';

@Module({
  imports: [
    MajorModule,
    ClassroomModule,
    DepartmentModule,
    PersonnelModule,
    RouterModule.register([
      {
        path: '/departments',
        module: DepartmentModule,
      },
      {
        path: '/majors',
        module: MajorModule,
      },
      {
        path: '/classrooms',
        module: ClassroomModule,
      },
      {
        path: '/personnel',
        module: PersonnelModule,
      },
    ]),
  ],
  providers: [CodeGeneratorService],
})
export class ConfiguratorModule {}
