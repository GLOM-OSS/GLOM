import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { MajorController } from './major.controller';
import { MajorService } from './major.service';

@Module({
  providers: [CodeGeneratorService, MajorService],
  controllers: [MajorController],
})
export class MajorModule {}
