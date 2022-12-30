import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CourseService } from './course.service';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';

@Controller()
@UseGuards(AuthenticatedGuard)
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('all')
  async getCourses(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    return this.courseService.findAll(academic_year_id, annual_teacher_id);
  }
}
