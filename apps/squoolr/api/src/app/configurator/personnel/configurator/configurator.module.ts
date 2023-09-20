import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../../utils/code-generator';
import { PersonnelService } from '../personnel.service';
import { ConfiguratorController } from './configurator.controller';

@Module({
  controllers: [ConfiguratorController],
  providers: [PersonnelService, CodeGeneratorService],
})
export class ConfiguratorModule {}
