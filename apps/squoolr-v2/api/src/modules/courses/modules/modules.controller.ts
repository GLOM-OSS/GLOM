import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Role } from '../../../utils/enums';
import {
  DisableCourseModuleDto,
  QueryCourseModuleDto,
  UpdateCourseModuleDto,
} from './module.dto';
import { ModuleEntity, CreateCourseModuleDto } from './module.dto';
import { CourseModulesService } from './modules.service';

@ApiTags('Course modules')
@Controller('course-modules')
@UseGuards(AuthenticatedGuard)
export class CourseModulesController {
  constructor(private courseModulesService: CourseModulesService) {}

  @Get()
  @ApiOkResponse({ type: [ModuleEntity] })
  getCourseModules(@Query() params: QueryCourseModuleDto) {
    return this.courseModulesService.findAll(params);
  }

  @Post('new')
  @Roles(Role.COORDINATOR)
  @ApiOkResponse({ type: ModuleEntity })
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
      newModule,
      { academic_year_id, school_id },
      annual_teacher_id
    );
  }

  @Put(':annual_module_id')
  @Roles(Role.COORDINATOR)
  updateModule(
    @Req() request: Request,
    @Param('annual_module_id') annualModuleId: string,
    @Body() updalePayload: UpdateCourseModuleDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseModulesService.update(
      annualModuleId,
      updalePayload,
      annual_teacher_id
    );
  }

  @Delete(':annual_module_id')
  @Roles(Role.COORDINATOR)
  disableModule(
    @Req() request: Request,
    @Param('annual_module_id') annualModuleId: string,
    @Query('disable') disable: UpdateCourseModuleDto['disable']
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseModulesService.disable(
      annualModuleId,
      disable,
      annual_teacher_id
    );
  }

  @Delete()
  @Roles(Role.COORDINATOR)
  disableManyModules(
    @Req() request: Request,
    @Query() disablePayload: DisableCourseModuleDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.courseModulesService.disableMany(
      disablePayload,
      annual_teacher_id
    );
  }
}
