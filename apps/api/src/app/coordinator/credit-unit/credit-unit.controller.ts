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
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Request } from 'express';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CreditUnitService } from './credit-unit.service';
import {
  CreditUnitPostDto,
  CreditUnitPutDto,
  CreditUnitQuery,
  CreditUnitSubjectPostDto,
} from '../coordinator.dto';
import { ERR07, ERR08 } from '../../../errors';

@Controller()
@ApiTags('UEs')
@Roles(Role.COORDINATOR)
@UseGuards(AuthenticatedGuard)
export class CreditUnitController {
  constructor(private creditUnitService: CreditUnitService) {}

  @Get('majors')
  async getCoordinatorMajors(@Req() request: Request) {
    const {
      annualTeacher: { classroomDivisions },
    } = request.user as DeserializeSessionData;
    return await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
  }

  @Get('all')
  async getCrediUnits(
    @Req() request: Request,
    @Query() query: CreditUnitQuery
  ) {
    const {
      annualTeacher: { classroomDivisions },
    } = request.user as DeserializeSessionData;
    const majors = await this.creditUnitService.getCoordinatorMajors(
      classroomDivisions
    );
    return await this.creditUnitService.getCreditUnits(
      majors.map(({ major_id }) => ({ major_id })),
      query
    );
  }

  @Post('new')
  async addNewCreditUnit(
    @Req() request: Request,
    @Body() newCreditUnit: CreditUnitPostDto
  ) {
    const {
      school_id,
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
      school_id,
      academic_year_id,
      annual_teacher_id,
    });
  }

  @Put(':annual_credit_unit_id/edit')
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

  @Post('subjects/new')
  async createCreditUnitSubject(
    @Req() request: Request,
    @Body() newCreditUnitSubject: CreditUnitSubjectPostDto
  ) {
    const {
      school_id,
      activeYear: { academic_year_id },
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    return this.creditUnitService.createCreditUnitSubject(
      newCreditUnitSubject,
      { school_id, academic_year_id, annual_teacher_id }
    );
  }
}
