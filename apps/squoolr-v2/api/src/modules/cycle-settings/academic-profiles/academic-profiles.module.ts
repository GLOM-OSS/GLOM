import { Module } from '@nestjs/common';
import { AcademicProfilesService } from './academic-profiles.service';
import { AcademicProfilesController } from './academic-profiles.controller';

@Module({
  providers: [AcademicProfilesService],
  controllers: [AcademicProfilesController],
})
export class AcademicProfilesModule {}
