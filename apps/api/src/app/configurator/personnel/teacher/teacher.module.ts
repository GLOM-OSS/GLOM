import { Module } from '@nestjs/common';
import { CodeGeneratorService } from 'apps/api/src/utils/code-generator';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  providers: [TeacherService, CodeGeneratorService],
  controllers: [TeacherController],
})
export class TeacherModule {}
