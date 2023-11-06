import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TeachersService } from './teachers/teachers.service';

@Module({
  controllers: [StaffController],
  providers: [
    StaffService,
    TeachersService,
    CodeGeneratorFactory,
    ConfiguratorsService,
    CoordinatorsService,
    RegistriesService,
  ],
})
export class StaffModule {}
