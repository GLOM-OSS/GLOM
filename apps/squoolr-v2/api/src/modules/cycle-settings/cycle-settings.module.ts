import { Module } from '@nestjs/common';
import { CycleSettingsService } from './cycle-settings.service';
import { CycleSettingsController } from './cycle-settings.controller';
import { AcademicProfilesModule } from './academic-profiles/academic-profiles.module';

@Module({
  imports: [AcademicProfilesModule],
  providers: [CycleSettingsService],
  controllers: [CycleSettingsController],
})
export class CycleSettingsModule {}
