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

  @Get('levels')
  async getLevels() {
    return { levels: await this.appService.getLevels() };
  }

  @Get('teacher-types')
  async getTeacherTypes() {
    return { teacher_types: await this.appService.getTeacherTypes() };
  }

  @Get('teacher-grades')
  async getTeacherGrades() {
    return { teacher_grades: await this.appService.getTeacherGrades() };
  }
}
