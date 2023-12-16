import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CourseModulesService } from './modules.service';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QueryCourseDto } from '../course.dto';
import { CourseModuleEntity } from './module.dto';

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
}
