import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../utils/types';
import { Roles } from './app.decorator';

import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('cycles')
  async getCycles() {
    return { cycles: await this.appService.getCycles() };
  }

  @Get('teacher-types')
  async getTeacherTypes() {
    return { teacherTypes: await this.appService.getTeacherTypes() };
  }

  @Get('teaching-grades')
  async getTeacherGrades() {
    return { teachingGrades: await this.appService.getTeacherGrades() };
  }

  @Get('evaluation-types')
  async getEvalutaionTpes() {
    return { evaluationTypes: await this.appService.getEvaluationTypes() };
  }

  @Get('subject-parts')
  async getSubjectParts() {
    return { subjectParts: await this.appService.getSubjectParts() };
  }

  @Get('weighting-grades')
  async getGrades() {
    return { weightingGrades: await this.appService.getGrades() };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthenticatedGuard)
  @Put('clear-unused-sessions-logs')
  async clearLogs() {
    try {
      return { log: await this.appService.closeLogs() };
    } catch (error) {
      throw new HttpException(
        `Sorry, an error occured when closing the logs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
