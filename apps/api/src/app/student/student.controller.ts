import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData } from '../../utils/types';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { StudentQueryQto } from './student.dto';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthenticatedGuard)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('all')
  async findStudents(@Req() request: Request, @Query() query: StudentQueryQto) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.studentService.getStudents(academic_year_id, query);
  }

  @Get(':annual_student_id/details')
  async findStudentDetalis(
    @Param('annual_student_id') annual_student_id: string
  ) {
    return this.studentService.getStudentDetails(annual_student_id);
  }
}
