import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AcademicProfileModule } from './academic-profiles/academic-profile.module';
import { GradeWeightingModule } from './grade-weightings/grade-weighting.module';
import { WeightingSystemModule } from './weighting-systems/weighting-system.module';

@Module({
  imports: [
    WeightingSystemModule,
    GradeWeightingModule,
    AcademicProfileModule,
    RouterModule.register([
      {
        path: 'weighting-system',
        module: WeightingSystemModule,
      },
      {
        path: 'grade-weightings',
        module: GradeWeightingModule,
      },
      {
        path: 'academic-profiles',
        module: AcademicProfileModule,
      },
    ]),
  ],
})
export class RegistryModule {}
