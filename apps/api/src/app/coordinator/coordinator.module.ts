import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CreditUnitSubjectModule } from './credit-unit-subjects/credit-unit-subject.module';
import { CreditUnitModule } from './credit-units/credit-unit.module';

@Module({
  imports: [
    CreditUnitModule,
    CreditUnitSubjectModule,
    RouterModule.register([
      {
        path: '/credit-units',
        module: CreditUnitModule,
      },
      {
        path: '/credit-unit-subjects',
        module: CreditUnitSubjectModule,
      },
    ]),
  ],
})
export class CoordinatorModule {}
