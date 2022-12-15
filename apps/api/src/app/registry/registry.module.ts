import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { GradeWeightingModule } from './grade-weightings/grade-weighting.module';
import { WeightingSystemModule } from './weighting-systems/weighting-system.module';

@Module({
  imports: [
    WeightingSystemModule,
    GradeWeightingModule,
    RouterModule.register([
      {
        path: 'weighting-system',
        module: WeightingSystemModule,
      },
      {
        path: 'grade-weightings',
        module: GradeWeightingModule,
      },
    ]),
  ],
})
export class RegistryModule {}
