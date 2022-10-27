import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { PersonnelController } from './personnel.controller';
import { PersonnelService } from './personnel.service';

@Module({
  controllers: [PersonnelController],
  providers: [PersonnelService, CodeGeneratorService],
})
export class PersonnelModule {}
