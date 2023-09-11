import { Module } from '@nestjs/common';
import { AcademicProfileController } from './academic-profile.controller';
import { AcademicProfileService } from './academic-profile.service';

@Module({
  controllers: [AcademicProfileController],
  providers: [AcademicProfileService],
})
export class AcademicProfileModule {}
