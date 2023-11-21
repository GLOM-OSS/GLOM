import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { QueryWeightingSettingsDto } from '../cycle-settings.dto';
import {
  CreateGradeWeightingDto,
  GradeWeightingEntity,
} from './grade-weighting.dto';
import { GradeWeightingsService } from './grade-weightings.service';
import { Roles } from '../../../app/auth/auth.decorator';
import { Role } from '../../../utils/enums';

@ApiTags('Grade Weightings')
@Controller('grade-weightings')
@UseGuards(AuthenticatedGuard)
export class GradeWeightingsController {
  constructor(private gradeWeightingsService: GradeWeightingsService) {}

  @Get()
  @ApiOkResponse({ type: [GradeWeightingEntity] })
  getGradeWeightings(
    @Req() request: Request,
    @Query() params: QueryWeightingSettingsDto
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user;
    return this.gradeWeightingsService.findAll({
      ...params,
      academic_year_id,
    });
  }

  @Post('new')
  @Roles(Role.REGISTRY)
  @ApiCreatedResponse({ type: GradeWeightingEntity })
  createGradeWeighting(
    @Req() request: Request,
    @Body() newGradeWeighting: CreateGradeWeightingDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user;
    return this.gradeWeightingsService.create(
      newGradeWeighting,
      academic_year_id,
      annual_registry_id
    );
  }
}
