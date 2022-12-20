import { Module } from '@nestjs/common';
import { CarryOverSystemController } from './carry-over-system.controller';
import { CarryOverSystemService } from './carry-over-system.service';

@Module({
  controllers: [CarryOverSystemController],
  providers: [CarryOverSystemService],
})
export class CarryOverSystemModule {}
