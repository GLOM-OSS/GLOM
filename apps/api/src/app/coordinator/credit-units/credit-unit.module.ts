import { Module } from '@nestjs/common';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { CreditUnitController } from './credit-unit.controller';
import { CreditUnitService } from './credit-unit.service';

@Module({
  controllers: [CreditUnitController],
  providers: [CreditUnitService, CodeGeneratorService],
})
export class CreditUnitModule {}
