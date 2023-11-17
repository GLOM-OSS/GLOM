import { Module } from '@nestjs/common';
import { CycleSettingsService } from './cycle-settings.service';
import { CycleSettingsController } from './cycle-settings.controller';

@Module({
  providers: [CycleSettingsService],
  controllers: [CycleSettingsController],
})
export class CycleSettingsModule {}
