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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Role } from '../../../utils/enums';
import { QueryCourseDto } from '../course.dto';
import {
  CreateResourceDto,
  ResourceEntity,
  UpdateResourceDto,
} from './resource.dto';
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

  @Post('new')
  @Roles(Role.TEACHER)
  @ApiCreatedResponse({ type: ResourceEntity })
  @UseInterceptors(AnyFilesInterceptor())
  uploadResource(
    @Req() request: Request,
    @Body() uploadPayload: CreateResourceDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.resourcesService.uploadResources(
      uploadPayload,
      files,
      annual_teacher_id
    );
  }

  @Delete()
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  deleteManyResources(@Req() request: Request, @Query() resourceIds: string[]) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.resourcesService.deleteMany(resourceIds, annual_teacher_id);
  }
}
