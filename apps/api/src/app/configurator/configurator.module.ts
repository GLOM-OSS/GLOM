import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../utils/code-generator';
import { DepartmentModule } from './department/department.module';
import { MajorModule } from './major/major.module';

@Module({
  imports: [
    MajorModule,
    DepartmentModule,
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
        ],
      },
    ]),
  ],
  providers: [CodeGeneratorService],
})
export class ConfiguratorModule {}
