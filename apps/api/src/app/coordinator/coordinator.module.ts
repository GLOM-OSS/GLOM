import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CreditUnitModule } from './credit-unit/credit-unit.module';

@Module({
  imports: [
    CreditUnitModule,
    RouterModule.register([
      {
        path: '/credit-units',
        module: CreditUnitModule,
      },
    ]),
  ],
})
export class CoordinatorModule {}
