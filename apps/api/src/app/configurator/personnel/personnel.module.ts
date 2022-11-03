import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { ConfiguratorModule } from './configurator/configurator.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { PersonnelController } from './personnel.controller';
import { PersonnelService } from './personnel.service';
import { RegistryModule } from './registry/registry.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    TeacherModule,
    RegistryModule,
    CoordinatorModule,
    ConfiguratorModule,
    RouterModule.register([
      {
        path: 'personnel',
        module: PersonnelModule,
        children: [
          {
            path: 'teachers',
            module: TeacherModule,
          },
          {
            path: 'registries',
            module: RegistryModule,
          },
          {
            path: 'configurators',
            module: ConfiguratorModule,
          },
          {
            path: 'coordinators',
            module: CoordinatorModule,
          },
        ],
      },
    ]),
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService, CodeGeneratorService],
})
export class PersonnelModule {}
