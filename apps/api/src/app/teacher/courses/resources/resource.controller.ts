import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { DeserializeSessionData, Role } from 'apps/api/src/utils/types';
import { Request } from 'express';
import { Roles } from '../../../app.decorator';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { LinkPostDto, ResourceOwner } from '../course.dto';
import { ResourceService } from './resource.service';

@ApiTags('Resources')
@Controller('resources')
@UseGuards(AuthenticatedGuard)
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('new-link')
  @Roles(Role.TEACHER)
  async addNewLink(@Req() request: Request, @Body() newLink: LinkPostDto) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.resourceService.createResource(
        'LINK',
        [newLink],
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('new-files')
  @Roles(Role.TEACHER)
  @UseInterceptors(FilesInterceptor('resources'))
  async addNewFile(
    @Req() request: Request,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() { chapter_id, annual_credit_unit_subject_id }: ResourceOwner
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.resourceService.createResource(
        'FILE',
        files.map(({ originalname, filename }) => ({
          annual_credit_unit_subject_id,
          resource_name: originalname,
          resource_ref: filename,
          chapter_id,
        })),
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
