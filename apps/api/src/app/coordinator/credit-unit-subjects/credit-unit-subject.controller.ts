import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import {
  CreditUnitSubjectPostDto,
  CreditUnitSubjectPutDto,
} from '../coordinator.dto';
import { CreditUnitSubjectService } from './credit-unit-subject.service';

@Controller()
export class CreditUnitSubjectController {
  constructor(private creditUnitSubjectService: CreditUnitSubjectService) {}

  @Post('/new')
  async createSubject(
    @Req() request: Request,
    @Body() newCreditUnitSubject: CreditUnitSubjectPostDto
  ) {
    const {
      school_id,
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    return this.creditUnitSubjectService.createCreditUnitSubject(newCreditUnitSubject, {
      school_id,
      created_by: annual_teacher_id,
    });
  }

  @Put('/:annual_credit_unit_subject_id/edit')
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
}
