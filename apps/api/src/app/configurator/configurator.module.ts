import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../utils/code-generator';
import { AcademicYearModule } from './academic-year/academic-year.module';
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
    AcademicYearModule,
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
      {
        path: '/academic-years',
        module: AcademicYearModule,
      },
    ]),
  ],
  providers: [CodeGeneratorService],
})
export class ConfiguratorModule {}
