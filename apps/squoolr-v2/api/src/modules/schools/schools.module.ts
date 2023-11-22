import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  providers: [SchoolsService, CodeGeneratorFactory],
  controllers: [SchoolsController],
})
export class SchoolsModule {}
