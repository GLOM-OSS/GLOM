import { Module } from '@nestjs/common';
import { CreditUnitController } from './credit-unit.controller';
import { CreditUnitService } from './credit-unit.service';

@Module({
  controllers: [CreditUnitController],
  providers: [CreditUnitService],
})
export class CreditUnitModule {}
