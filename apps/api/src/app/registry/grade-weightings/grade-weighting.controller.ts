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
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { GradeWeightingPostDto, GradeWeightingPutDto } from '../registry.dto';
import { GradeWeightingService } from './grade-weighting.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class GradeWeightingController {
  constructor(private gradeWeightingService: GradeWeightingService) {}

  @Get('all')
  async getGradeWeightings() {
    return await this.gradeWeightingService.getAnnualGradeWeightings();
  }

  @Get(':annnual_grade_weighting_id')
  async getGradeWeighting(
    @Param('annual_grade_weighting_id') annual_grade_weighting_id: string
  ) {
    return await this.gradeWeightingService.getAnnualGradeWeighting(
      annual_grade_weighting_id
    );
  }

  @Post('new')
  @Roles(Role.REGISTRY)
  async addNewGradeWeighting(
    @Req() request: Request,
    @Body() newGradeWeighting: GradeWeightingPostDto
  ) {
    const {
      activeYear: { academic_year_id },
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.gradeWeightingService.addNewGradeWeighting(
        newGradeWeighting,
        academic_year_id,
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':annual_grade_weighting_id/edit')
  @Roles(Role.REGISTRY)
  async updateGradeWeighting(
    @Req() request: Request,
    @Param('annual_grade_weighting_id') annual_grade_weighting_id: string,
    @Body() { cycle_id, grade_id, ...updatedData }: GradeWeightingPutDto
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.gradeWeightingService.updateGradeWeighting(
        annual_grade_weighting_id,
        {
          ...updatedData,
          ...(cycle_id ? { Cycle: { connect: { cycle_id } } } : {}),
          ...(grade_id ? { Grade: { connect: { grade_id } } } : {}),
        },
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':annual_grade_weighting_id/delete')
  @Roles(Role.REGISTRY)
  async deleteGradeWeighting(
    @Req() request: Request,
    @Param('annual_grade_weighting_id') annual_grade_weighting_id: string
  ) {
    const {
      annualRegistry: { annual_registry_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.gradeWeightingService.updateGradeWeighting(
        annual_grade_weighting_id,
        { is_deleted: true },
        annual_registry_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
