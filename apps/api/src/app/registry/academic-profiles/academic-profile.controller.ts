import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { AcademicProfileService } from './academic-profile.service';
import { AcademicProfilePostDto, AcademicProfilePutDto } from '../registry.dto';
import { Roles } from '../../app.decorator';

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

  @Roles(Role.REGISTRY)
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

  @Roles(Role.REGISTRY)
  @Put(':annual_academic_profile_id/edit')
  async updateAcademicProfile(
    @Req() request: Request,
    @Param('annual_academic_profile_id') annual_academic_profile_id: string,
    @Body() updatedData: AcademicProfilePutDto
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.academicProfileService.updateAcademicProfile(
        annual_academic_profile_id,
        updatedData,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.REGISTRY)
  @Delete(':annual_academic_profile_id/delete')
  async deleteAcademicProfile(
    @Req() request: Request,
    @Param('annual_academic_profile_id') annual_academic_profile_id: string
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.academicProfileService.updateAcademicProfile(
        annual_academic_profile_id,
        { is_deleted: true },
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
