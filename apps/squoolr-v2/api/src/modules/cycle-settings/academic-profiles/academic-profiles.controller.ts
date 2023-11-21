import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { Role } from '../../../utils/enums';
import { UpdateWeightingSystemDto } from '../cycle-settings.dto';
import {
  AcademicProfileEntity,
  CreateAcademicProfileDto,
  UpdateAcademicProfileDto,
} from './academic-profile.dto';
import { AcademicProfilesService } from './academic-profiles.service';

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
    return this.academicProfilesService.findAll({
      ...params,
      academic_year_id,
    });
  }

  @Post('new')
  @Roles(Role.REGISTRY)
  @ApiCreatedResponse({ type: AcademicProfileEntity })
  createAcademicProfile(
    @Req() request: Request,
    @Body() academicPayload: CreateAcademicProfileDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.academicProfilesService.create(
      academicPayload,
      academic_year_id,
      annual_registry_id
    );
  }

  @ApiOkResponse()
  @Roles(Role.REGISTRY)
  @Put(':annual_academic_profile_id')
  updateAcademicProfile(
    @Req() request: Request,
    @Param('annual_academic_profile_id') academicProfileId: string,
    @Body() academicPayload: UpdateAcademicProfileDto
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.academicProfilesService.update(
      academicProfileId,
      academicPayload,
      annual_registry_id
    );
  }
}
