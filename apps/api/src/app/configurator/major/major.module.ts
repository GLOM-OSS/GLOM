import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { MajorCotroller } from './major.controller';
import { MajorService } from './major.service';

@Module({
  providers: [CodeGeneratorService, MajorService],
  controllers: [MajorCotroller],
})
export class MajorModule {}
