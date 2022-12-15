import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { WeightingSystemModule } from './weighting-systems/weighting-system.module';

@Module({
  imports: [
    WeightingSystemModule,
    RouterModule.register([
      {
        path: 'weighting-system',
        module: WeightingSystemModule,
      },
    ]),
  ],
})
export class RegistryModule {}
