import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../app/auth/auth.guard';
import { CoursesService } from './courses.service';
import { CourseEntity } from './course.dto';
import { Request } from 'express';
import { Roles } from '../../app/auth/auth.decorator';
import { Role } from '../../utils/enums';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(AuthenticatedGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @Roles(Role.TEACHER)
  @ApiOkResponse({ type: [CourseEntity] })
  getCourses(@Req() request: Request) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.coursesService.getCourses({ annual_teacher_id });
  }

  @Get(':annual_subject_id')
  @ApiOkResponse({ type: CourseEntity })
  getCourse(@Param() annualSubjectId: string) {
    return this.coursesService.getCourse(annualSubjectId);
  }
}
