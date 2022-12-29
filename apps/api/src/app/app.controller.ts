import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

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
}
