import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeserializeSessionData } from '../../../utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { AcademicProfileService } from './academic-profile.service';
import { AcademicProfilePostDto } from '../registry.dto';

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

  @Post('new')
  async addNewAcademicProfile(
    @Req() request: Request,
    @Body() newAcademicProfile: AcademicProfilePostDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.academicProfileService.addNewAcademicProfile(
        newAcademicProfile,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
