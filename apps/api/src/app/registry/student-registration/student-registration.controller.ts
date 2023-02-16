import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DeserializeSessionData } from 'apps/api/src/utils/types';
import { Request } from 'express';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { StudentQueryQto } from '../registry.dto';
import { StudentRegistrationService } from './student-registration.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class StudentRegistrationController {
  constructor(private studentRegistrationService: StudentRegistrationService) {}

  @Get('all')
  async findStudents(@Req() request: Request, @Query() query: StudentQueryQto) {
    const {
      activeYear: { academic_year_id },
    } = request.user as DeserializeSessionData;
    return this.studentRegistrationService.getStudents(academic_year_id, query);
  }
}
