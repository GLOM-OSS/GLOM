import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DeserializeSessionData } from '../../../utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { AcademicProfileService } from './academic-profile.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class AcademicProfileController {
  constructor(private academicProfileService: AcademicProfileService) {}

  @Get('all')
  async getAcademicProfiles(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.academicProfileService.getAcademicProfiles(academic_year_id);
  }
  @Get(':annual_academic_profile_id')
  async getAcademicProfile(
    @Param('annual_academic_profile_id') annual_academic_profile_id: string
  ) {
    return this.academicProfileService.getAcademicProfile(
      annual_academic_profile_id
    );
  }
}
