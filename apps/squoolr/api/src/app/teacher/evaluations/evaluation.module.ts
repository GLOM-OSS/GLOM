import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService, CodeGeneratorService],
})
export class EvaluationModule {}
