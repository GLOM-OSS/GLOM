import { Module } from '@nestjs/common';
import { CycleSettingsService } from './cycle-settings.service';
import { CycleSettingsController } from './cycle-settings.controller';
import { AcademicProfilesModule } from './academic-profiles/academic-profiles.module';
import { GradeWeightingsModule } from './grade-weightings/grade-weightings.module';

@Module({
  providers: [CycleSettingsService],
  controllers: [CycleSettingsController],
  imports: [AcademicProfilesModule, GradeWeightingsModule],
})
export class CycleSettingsModule {}
