import { Module } from '@nestjs/common';
import { WeightingSystemController } from './weighting-system.controller';
import { WeightingSystemService } from './weighting-system.service';

@Module({
  controllers: [WeightingSystemController],
  providers: [WeightingSystemService],
})
export class WeightingSystemModule {}
