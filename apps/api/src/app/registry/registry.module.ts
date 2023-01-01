import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AcademicProfileModule } from './academic-profiles/academic-profile.module';
import { CarryOverSystemModule } from './carry-over-system/carry-over-system.module';
import { HallAccessModule } from './hall-access/hall-access.module';
import { GradeWeightingModule } from './grade-weightings/grade-weighting.module';
import { WeightingSystemModule } from './weighting-systems/weighting-system.module';

@Module({
  imports: [
    WeightingSystemModule,
    CarryOverSystemModule,
    GradeWeightingModule,
    AcademicProfileModule,
    HallAccessModule,
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
        path: 'hall-accesses',
        module: HallAccessModule,
      },
    ]),
  ],
})
export class RegistryModule {}
