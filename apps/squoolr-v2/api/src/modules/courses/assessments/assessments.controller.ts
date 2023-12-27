import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { AssessmentEntity, QueryAssessmentDto } from './assessment.dto';

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
}
