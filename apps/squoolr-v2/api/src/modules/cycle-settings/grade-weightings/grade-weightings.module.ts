import { Module } from '@nestjs/common';
import { GradeWeightingsService } from './grade-weightings.service';
import { GradeWeightingsController } from './grade-weightings.controller';

@Module({
  providers: [GradeWeightingsService],
  controllers: [GradeWeightingsController],
})
export class GradeWeightingsModule {}
