import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../../utils/code-generator';
import { PersonnelService } from '../personnel.service';
import { RegistryController } from './registry.controller';

@Module({
  providers: [PersonnelService, CodeGeneratorService],
  controllers: [RegistryController],
})
export class RegistryModule {}
