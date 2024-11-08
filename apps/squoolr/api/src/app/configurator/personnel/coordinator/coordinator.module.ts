import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../../utils/code-generator';
import { PersonnelService } from '../personnel.service';
import { CoordinatorController } from './coordinator.controller';

@Module({
  controllers: [CoordinatorController],
  providers: [PersonnelService, CodeGeneratorService],
})
export class CoordinatorModule {}
