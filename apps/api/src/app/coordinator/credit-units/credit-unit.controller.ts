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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ERR07, ERR08 } from '../../../errors';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  CreditUnitPostDto,
  CreditUnitPutDto,
  CreditUnitQuery,
} from '../coordinator.dto';
import { CreditUnitService } from './credit-unit.service';

@Controller()
@ApiTags('UEs')
@UseGuards(AuthenticatedGuard)
export class CreditUnitController {
  constructor(private creditUnitService: CreditUnitService) {}

  @Get('majors')
  @Roles(Role.COORDINATOR)
  async getCoordinatorMajors(@Req() request: Request) {
    const {
      annualTeacher: { classroomDivisions },
    } = request.user as DeserializeSessionData;
    return await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
  }

  @Get('all')
  async getCrediUnits(@Query() query: CreditUnitQuery) {
    return await this.creditUnitService.getCreditUnits(query);
  }

  @Get(':credit_unit_id_or_code')
  async getCreditUnitDetails(
    @Param('credit_unit_id_or_code') credit_unit_id_or_code: string
  ) {
    return await this.creditUnitService.getCreditUnitDetails(
      credit_unit_id_or_code
    );
  }

  @Post('new')
  @Roles(Role.COORDINATOR)
  async addNewCreditUnit(
    @Req() request: Request,
    @Body() newCreditUnit: CreditUnitPostDto
  ) {
    const {
      preferred_lang,
      activeYear: { academic_year_id },
      annualTeacher: { classroomDivisions, annual_teacher_id },
    } = request.user as DeserializeSessionData;
    const majorIds = await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
    const creditUnitMajor = majorIds.find(
      (_) => _.major_id === newCreditUnit.major_id
    );
    if (!creditUnitMajor)
      throw new HttpException(ERR07[preferred_lang], HttpStatus.FORBIDDEN);
    if (newCreditUnit.semester_number > creditUnitMajor.number_of_years * 2)
      throw new HttpException(ERR08[preferred_lang], HttpStatus.FORBIDDEN);
    return await this.creditUnitService.createCreditUnit(newCreditUnit, {
      academic_year_id,
      annual_teacher_id,
    });
  }

  @Put(':annual_credit_unit_id/edit')
  @Roles(Role.COORDINATOR)
  async updateCreditUnit(
    @Req() request: Request,
    @Param('annual_credit_unit_id') annual_credit_unit_id: string,
    @Body() updateData: CreditUnitPutDto
  ) {
    const {
      preferred_lang,
      annualTeacher: { classroomDivisions, annual_teacher_id },
    } = request.user as DeserializeSessionData;
    const majorIds = await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
    const creditUnitMajor = majorIds.find(
      (_) => _.major_id === updateData.major_id
    );
    if (!creditUnitMajor)
      throw new HttpException(ERR07[preferred_lang], HttpStatus.FORBIDDEN);
    if (updateData.semester_number > creditUnitMajor.number_of_years * 2)
      throw new HttpException(ERR08[preferred_lang], HttpStatus.FORBIDDEN);
    await this.creditUnitService.updateCreditUnit(
      annual_credit_unit_id,
      updateData,
      annual_teacher_id
    );
  }

  @Delete(':annual_credit_unit_id/delete')
  @Roles(Role.COORDINATOR)
  async deleteCreditUnit(
    @Req() request: Request,
    @Param('annual_credit_unit_id') annual_credit_unit_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    await this.creditUnitService.updateCreditUnit(
      annual_credit_unit_id,
      { is_deleted: true },
      annual_teacher_id
    );
  }
}
