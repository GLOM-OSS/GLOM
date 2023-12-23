import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  providers: [SubjectsService, CodeGeneratorFactory],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
