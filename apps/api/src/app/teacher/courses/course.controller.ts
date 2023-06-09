import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { CourseQueryDto } from './course.dto';
import { CourseService } from './course.service';

@Controller()
@ApiTags('Courses')
@UseGuards(AuthenticatedGuard)
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('all')
  async getCourses(
    @Req() request: Request,
    @Query() { semester_number }: CourseQueryDto
  ) {
    const {
      annualTeacher,
      annualStudent,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.courseService.findAll(academic_year_id, {
      ...(annualTeacher
        ? {
            AnnualTeacher: {
              annual_teacher_id: annualTeacher.annual_teacher_id,
            },
          }
        : annualStudent
        ? {
            AnnualCreditUnit: {
              AnnualStudentHasCreditUnits: {
                some: { annual_student_id: annualStudent.annual_student_id },
              },
            },
          }
        : {}),
      AnnualCreditUnit: { semester_number },
    });
  }

  @Get(':annual_credit_unit_subject_id')
  async getCourse(
    @Req() request: Request,
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.courseService.findOne(
      academic_year_id,
      annual_credit_unit_subject_id
    );
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
    annual_credit_unit_subject_id: string,
    @Query('isNotDone') isNotDone: boolean
  ) {
    return this.courseService.findChapters(
      annual_credit_unit_subject_id,
      isNotDone
    );
  }

  @Get(':annual_credit_unit_subject_id/assessments')
  async getAssessments(
    @Req() request: Request,
    @Query('is_assignment') isAssignment: boolean,
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    const { annualStudent } = request.user as DeserializeSessionData;
    return this.courseService.findAssessments(
      annual_credit_unit_subject_id,
      isAssignment,
      Boolean(annualStudent)
    );
  }

  @Get(':annual_credit_unit_subject_id/students')
  async getStudents(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findStudents(annual_credit_unit_subject_id);
  }

  @Get(':annual_credit_unit_subject_id/presence-lists')
  async getPreseneceLists(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findPresentLists(annual_credit_unit_subject_id);
  }
}
