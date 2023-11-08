import { Module } from '@nestjs/common';
import { MajorsController } from './majors.controller';
import { MajorsService } from './majors.service';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';

@Module({
  providers: [CodeGeneratorFactory, MajorsService],
  controllers: [MajorsController],
})
export class MajorsModule {}
