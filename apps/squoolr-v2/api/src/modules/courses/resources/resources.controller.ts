import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { QueryCourseDto } from '../course.dto';
import { ResourceEntity, UpdateResourceDto } from './resource.dto';
import { ResourcesService } from './resources.service';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { Role } from '../../../utils/enums';

@ApiTags('Course resources')
@UseGuards(AuthenticatedGuard)
@Controller('courses/resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get()
  @ApiOkResponse({ type: [ResourceEntity] })
  getResources(@Query() params: QueryCourseDto) {
    return this.resourcesService.findAll(params);
  }

  @Put(':resource_id')
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  updateResource(
    @Req() request: Request,
    @Param('resource_id') resourceId: string,
    @Body() updatePayload: UpdateResourceDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.resourcesService.update(
      resourceId,
      updatePayload,
      annual_teacher_id
    );
  }

  @Delete(':resource_id')
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  deleteResource(
    @Req() request: Request,
    @Param('resource_id') resourceId: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.resourcesService.delete(resourceId, annual_teacher_id);
  }
}
