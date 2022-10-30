import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../../utils/code-generator';
import { PersonnelService } from '../personnel.service';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  providers: [TeacherService, PersonnelService, CodeGeneratorService],
  controllers: [TeacherController],
})
export class TeacherModule {}
