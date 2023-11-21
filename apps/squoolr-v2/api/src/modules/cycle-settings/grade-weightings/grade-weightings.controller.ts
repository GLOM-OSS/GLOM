import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { QueryWeightingSettingsDto } from '../cycle-settings.dto';
import { GradeWeightingEntity } from './grade-weighting.dto';
import { GradeWeightingsService } from './grade-weightings.service';

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
    return this.gradeWeightingsService.getGradeWeightings({
      ...params,
      academic_year_id,
    });
  }
}
