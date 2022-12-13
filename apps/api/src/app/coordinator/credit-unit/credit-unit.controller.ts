import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
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
import { CreditUnitPostDto, CreditUnitQuery } from '../coordinator.dto';
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
}
