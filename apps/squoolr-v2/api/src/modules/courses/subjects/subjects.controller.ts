import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { QueryCourseSubjectDto, SubjectEntity } from './subject.dto';
import { CourseSubjectsService } from './subjects.service';

@ApiTags('Course subjects')
@Controller('course-subjects')
@UseGuards(AuthenticatedGuard)
export class CourseSubjectsController {
  constructor(private courseSubjectsService: CourseSubjectsService) {}

  @Get()
  @ApiOkResponse({ type: [SubjectEntity] })
  getCourseSubjects(@Query() params?: QueryCourseSubjectDto) {
    return this.courseSubjectsService.findAll(params);
  }
}
