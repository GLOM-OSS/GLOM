import {
  BadRequestException,
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Role } from '../../../utils/enums';
import {
  CreateCourseSubjectDto,
  DisableCourseSubjectDto,
  QueryCourseSubjectDto,
  SubjectEntity,
  UpdateCourseSubjectDto,
} from './subject.dto';
import { SubjectsService } from './subjects.service';

@ApiTags('Course subjects')
@Controller('courses/subjects')
@UseGuards(AuthenticatedGuard)
export class SubjectsController {
  constructor(private courseSubjectsService: SubjectsService) {}

  @Get()
  @ApiOkResponse({ type: [SubjectEntity] })
  getSubjects(@Query() params?: QueryCourseSubjectDto) {
    return this.courseSubjectsService.findAll(params);
  }

  @Post('new')
  @Roles(Role.COORDINATOR)
  @ApiCreatedResponse({ type: SubjectEntity })
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

  @Delete(':annual_subject_id')
  @Roles(Role.COORDINATOR)
  disableSubject(
    @Req() request: Request,
    @Param('annual_subject_id') annualSubjectId: string,
    @Query('disable') disable: UpdateCourseSubjectDto['disable']
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseSubjectsService.disable(
      annualSubjectId,
      disable,
      annual_teacher_id
    );
  }

  @Delete()
  @Roles(Role.COORDINATOR)
  disableManySubjects(
    @Req() request: Request,
    @Query() disablePayload: DisableCourseSubjectDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseSubjectsService.disableMany(
      disablePayload,
      annual_teacher_id
    );
  }
}
