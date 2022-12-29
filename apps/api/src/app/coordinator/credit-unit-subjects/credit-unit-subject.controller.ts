import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../utils/types';
import { Roles } from '../../app.decorator';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import {
  CreditUnitSubjectPostDto,
  CreditUnitSubjectPutDto,
} from '../coordinator.dto';
import { CreditUnitSubjectService } from './credit-unit-subject.service';

@Controller()
@ApiTags('UVs')
@UseGuards(AuthenticatedGuard)
export class CreditUnitSubjectController {
  constructor(private creditUnitSubjectService: CreditUnitSubjectService) {}

  @Get(':credit_unit_subject_id_or_code')
  async getCreditUnitDetails(
    @Param('credit_unit_subject_id_or_code')
    credit_unit_subject_id_or_code: string
  ) {
    return await this.creditUnitSubjectService.getCreditUnitSubjectDetails(
      credit_unit_subject_id_or_code
    );
  }

  @Get(':annual_credit_unit_id/all')
  async getCreditUnitSubjects(
    @Param('annual_credit_unit_id') annual_credit_unit_id: string
  ) {
    return await this.creditUnitSubjectService.getCreditUnitSubjects(
      annual_credit_unit_id
    );
  }

  @Post('/new')
  @Roles(Role.COORDINATOR)
  async createSubject(
    @Req() request: Request,
    @Body() newCreditUnitSubject: CreditUnitSubjectPostDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    return this.creditUnitSubjectService.createCreditUnitSubject(
      newCreditUnitSubject,
      annual_teacher_id
    );
  }

  @Put('/:annual_credit_unit_subject_id/edit')
  @Roles(Role.COORDINATOR)
  async updateSubject(
    @Req() request: Request,
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string,
    @Body() newCreditUnitSubject: CreditUnitSubjectPutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    await this.creditUnitSubjectService.updateCreditUnitSubject(
      annual_credit_unit_subject_id,
      newCreditUnitSubject,
      annual_teacher_id
    );
  }

  @Delete('/:annual_credit_unit_subject_id/delete')
  @Roles(Role.COORDINATOR)
  async deleteSubject(
    @Req() request: Request,
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    await this.creditUnitSubjectService.deleteCreditUnitSubject(
      annual_credit_unit_subject_id,
      annual_teacher_id
    );
  }
}
