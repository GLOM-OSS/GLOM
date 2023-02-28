import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ERR20 } from '../../errors';
import { DeserializeSessionData, Role } from '../../utils/types';
import { Roles } from '../app.decorator';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { CreatePaymentDto, StudentQueryQto } from './student.dto';
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

  @Get('details')
  async findStudentDetalis(
    @Req() request: Request,
    @Query('annual_student_id') annual_student_id: string
  ) {
    const { annualStudent, preferred_lang } =
      request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    return this.studentService.getStudentDetails(
      annualStudent?.annual_student_id ?? annual_student_id
    );
  }

  @Get('absences')
  async findStudentAbsences(
    @Req() request: Request,
    @Query('annual_student_id') annual_student_id: string
  ) {
    const {
      annualStudent,
      preferred_lang,
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    return this.studentService.getStudentAbsences(
      academic_year_id,
      annualStudent?.annual_student_id ?? annual_student_id
    );
  }

  @Get('fees')
  @Roles(Role.REGISTRY, Role.STUDENT, Role.PARENT)
  async findStudentFeeSummary(
    @Req() request: Request,
    @Query('annual_student_id') annual_student_id: string
  ) {
    const { annualStudent, preferred_lang } =
      request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    return this.studentService.getStudentFeeSummary(
      annualStudent?.annual_student_id ?? annual_student_id
    );
  }

  @Post('pay-fee')
  @Roles(Role.STUDENT, Role.PARENT)
  async payStudentFee(
    @Req() request: Request,
    @Body() { annual_student_id, ...newPayment }: CreatePaymentDto
  ) {
    const { annualStudent, preferred_lang, login_id } =
      request.user as DeserializeSessionData;
    if (!annualStudent && !annual_student_id)
      throw new HttpException(
        ERR20('student id')[preferred_lang],
        HttpStatus.BAD_REQUEST
      );
    try {
      return this.studentService.payStudentFee(
        {
          annual_student_id:
            annualStudent.annual_student_id ?? annual_student_id,
          ...newPayment,
        },
        login_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
