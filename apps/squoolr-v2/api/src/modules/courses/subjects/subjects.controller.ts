import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Role } from '../../../utils/enums';
import {
  CreateCourseSubjectDto,
  QueryCourseSubjectDto,
  SubjectEntity,
  UpdateCourseSubjectDto,
} from './subject.dto';
import { CourseSubjectsService } from './subjects.service';

@ApiTags('Course subjects')
@Controller('course-subjects')
@UseGuards(AuthenticatedGuard)
export class CourseSubjectsController {
  constructor(private courseSubjectsService: CourseSubjectsService) {}

  @Get()
  @ApiOkResponse({ type: [SubjectEntity] })
  getSubjects(@Query() params?: QueryCourseSubjectDto) {
    return this.courseSubjectsService.findAll(params);
  }

  @Post('new')
  @Roles(Role.COORDINATOR)
  @ApiOkResponse({ type: SubjectEntity })
  createSubject(
    @Req() request: Request,
    @Body() payload: CreateCourseSubjectDto
  ) {
    if (
      (payload.annual_module_id && payload.module) ||
      (!payload.annual_module_id && !payload.module)
    )
      throw new BadRequestException(
        'Only provide one the followings: `annual_module_id`, `module`'
      );
    const {
      school_id,
      activeYear: { academic_year_id },
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseSubjectsService.create(
      payload,
      { school_id, academic_year_id },
      annual_teacher_id
    );
  }

  @Put(':annual_subject_id')
  @Roles(Role.COORDINATOR)
  @ApiOkResponse({ type: SubjectEntity })
  updateSubject(
    @Req() request: Request,
    @Param('annual_subject_id') annualSubjectId: string,
    @Body() payload: UpdateCourseSubjectDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseSubjectsService.update(
      annualSubjectId,
      payload,
      annual_teacher_id
    );
  }
}
