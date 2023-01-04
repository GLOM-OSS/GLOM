import {
  Controller, Get, Param, Req, UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CourseService } from './course.service';

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

  @Get(':annual_credit_unit_subject_id')
  async getCourse(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findOne(annual_credit_unit_subject_id);
  }

  @Get(':annual_credit_unit_subject_id/resources')
  async getResources(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findResources(annual_credit_unit_subject_id);
  }

  @Get(':annual_credit_unit_subject_id/chapters')
  async getCourseChapters(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findChapters(annual_credit_unit_subject_id);
  }
}
