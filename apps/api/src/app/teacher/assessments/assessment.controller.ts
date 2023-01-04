import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeserializeSessionData } from '../../../utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { ResourceOwner } from '../courses/course.dto';
import { AssessmentService } from './assessment.service';

@Controller()
@ApiTags('Assessments')
@UseGuards(AuthenticatedGuard)
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post('new')
  async createAssessment(
    @Req() request: Request,
    @Body() { annual_credit_unit_subject_id }: ResourceOwner
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return await this.assessmentService.createAssessment(
        annual_credit_unit_subject_id,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
