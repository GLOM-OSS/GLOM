import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AcademicProfileModule } from './academic-profiles/academic-profile.module';
import { CarryOverSystemModule } from './carry-over-system/carry-over-system.module';
import { EvaluationModule } from './evaluations/evaluation.module';
import { GradeWeightingModule } from './grade-weightings/grade-weighting.module';
import { WeightingSystemModule } from './weighting-systems/weighting-system.module';

@Module({
  imports: [
    WeightingSystemModule,
    CarryOverSystemModule,
    GradeWeightingModule,
    AcademicProfileModule,
    EvaluationModule,
    RouterModule.register([
      {
        path: 'weighting-system',
        module: WeightingSystemModule,
      },
      {
        path: 'carry-over-system',
        module: CarryOverSystemModule,
      },
      {
        path: 'grade-weightings',
        module: GradeWeightingModule,
      },
      {
        path: 'academic-profiles',
        module: AcademicProfileModule,
      },
      {
        path: 'evaluations',
        module: EvaluationModule,
      },
    ]),
  ],
})
export class RegistryModule {}
