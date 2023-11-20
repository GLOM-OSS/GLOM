import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AcademicProfileEntity } from './academic-profile.dto';
import { AcademicProfilesService } from './academic-profiles.service';
import { UpdateWeightingSystemDto } from '../cycle-settings.dto';

@ApiTags('Academic Profiles')
@Controller('academic-profiles')
export class AcademicProfilesController {
  constructor(private academicProfilesService: AcademicProfilesService) {}

  @Get()
  @ApiOkResponse({ type: [AcademicProfileEntity] })
  getAcademicProfiles(
    @Req() request: Request,
    @Query() params: UpdateWeightingSystemDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.academicProfilesService.getAcademicProfiles({
      ...params,
      academic_year_id,
    });
  }
}
