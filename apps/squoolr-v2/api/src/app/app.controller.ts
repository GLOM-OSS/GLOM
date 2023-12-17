import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  PlatformSettingsEntity,
  SubjectPartEntity,
  TeacherTypeEntity,
  TeachingGradeEntity,
} from './app.dto';
import { CycleEntity } from '../modules/modules.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/platform-settings')
  @ApiOkResponse({ type: PlatformSettingsEntity })
  getPlatformSettings() {
    return this.appService.getPlatformSettings();
  }

  @Get('teacher-types')
  @ApiOkResponse({ type: [TeacherTypeEntity] })
  getTeacherTypes() {
    return this.appService.getTeacherTypes();
  }

  @Get('teaching-grades')
  @ApiOkResponse({ type: [TeachingGradeEntity] })
  getTeachingGrades() {
    return this.appService.getTeachingGrades();
  }

  @Get('cycles')
  @ApiOkResponse({ type: [CycleEntity] })
  getCycles() {
    return this.appService.getCycles();
  }

  @Get('subject-parts')
  @ApiOkResponse({ type: [SubjectPartEntity] })
  getSubjectParts() {
    return this.appService.getSubjectParts();
  }
}
