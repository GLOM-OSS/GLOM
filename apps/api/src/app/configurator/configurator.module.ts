import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../utils/code-generator';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
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
        ],
      },
    ]),
  ],
  providers: [CodeGeneratorService],
})
export class ConfiguratorModule {}
