import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import {
  AssessmentEntity,
  CreateAssessmentDto,
  PublishAssessmentDto,
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

  @Put(':assessment_id')
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  publishAssesment(
    @Req() request: Request,
    @Param('assessment_id') assessmentId: string,
    @Body() payload: PublishAssessmentDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.assessmentsService.publish(
      assessmentId,
      payload,
      annual_teacher_id
    );
  }

  @Delete([
    ':assessment_id/unpublish',
    ':assessment_id/enable',
    ':assessment_id/disable',
  ])
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  updateAssesment(
    @Req() request: Request,
    @Param('assessment_id') assessmentId: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.assessmentsService.update(
      assessmentId,
      request.url.split('/').pop() as 'unpublish' | 'enable' | 'disable',
      annual_teacher_id
    );
  }
}
