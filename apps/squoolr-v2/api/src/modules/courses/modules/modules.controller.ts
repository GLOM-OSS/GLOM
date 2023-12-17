import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Role } from '../../../utils/enums';
import { QueryCourseDto } from '../course.dto';
import { CourseModuleEntity, CreateCourseModuleDto } from './module.dto';
import { CourseModulesService } from './modules.service';

@ApiTags('Course modules')
@Controller('course-modules')
@UseGuards(AuthenticatedGuard)
export class CourseModulesController {
  constructor(private courseModulesService: CourseModulesService) {}

  @Get()
  @ApiOkResponse({ type: [CourseModuleEntity] })
  getCourseModules(@Query() params: QueryCourseDto) {
    return this.courseModulesService.findAll(params);
  }

  @Post('new')
  @Roles(Role.COORDINATOR)
  @ApiOkResponse({ type: CourseModuleEntity })
  createCourseModule(
    @Req() request: Request,
    @Body() newModule: CreateCourseModuleDto
  ) {
    const {
      school_id,
      activeYear: { academic_year_id },
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseModulesService.create(
      { ...newModule, academic_year_id, school_id },
      annual_teacher_id
    );
  }
}
