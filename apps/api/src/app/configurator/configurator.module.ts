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
        path: 'configurator',
        module: ConfiguratorModule,
        children: [
          {
            path: '/',
            module: DepartmentModule,
          },
          {
            path: '/',
            module: MajorModule,
          },
          {
            path: '/',
            module: ClassroomModule,
          },
          {
            path: '/',
            module: PersonnelModule,
          },
        ],
      },
    ]),
  ],
  providers: [CodeGeneratorService],
})
export class ConfiguratorModule {}
