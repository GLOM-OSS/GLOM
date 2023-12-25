import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { QueryCourseDto } from '../course.dto';
import { ResourceEntity } from './resource.dto';
import { ResourcesService } from './resources.service';

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
}
