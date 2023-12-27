import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import {
  AssessmentEntity,
  CreateAssessmentDto,
  QueryAssessmentDto,
} from './assessment.dto';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { Role } from '../../../utils/enums';

@ApiTags('Course assessments')
@UseGuards(AuthenticatedGuard)
@Controller('courses/assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Get()
  @ApiOkResponse({ type: [AssessmentEntity] })
  getAssessments(@Query() params?: QueryAssessmentDto) {
    return this.assessmentsService.findAll(params);
  }

  @Post('new')
  @Roles(Role.TEACHER)
  @ApiCreatedResponse({ type: AssessmentEntity })
  createAssessment(
    @Req() request: Request,
    @Body() payload: CreateAssessmentDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.assessmentsService.create(payload, annual_teacher_id);
  }
}
