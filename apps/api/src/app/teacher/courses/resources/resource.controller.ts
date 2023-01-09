import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AUTH404 } from '../../../../errors';
import { DeserializeSessionData, Role } from '../../../../utils/types';
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
        files.map(({ originalname, filename }) => {
          const nameParts = originalname.split('.');
          return {
            annual_credit_unit_subject_id,
            resource_ref: filename,
            resource_extension: nameParts[nameParts.length - 1],
            resource_name: nameParts.slice(0, nameParts.length - 1).join(),
            chapter_id,
          };
        }),
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(Role.TEACHER)
  @Delete(':resource_id/delete')
  async deleteResource(
    @Req() request: Request,
    @Param('resource_id') resource_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.resourceService.deleteResource(resource_id, annual_teacher_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':resource_id/download')
  async downloadResource(
    @Req() request: Request,
    @Param('resource_id') resource_id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { preferred_lang } = request.user as DeserializeSessionData;
    const resource = await this.resourceService.getResource(resource_id);
    if (!resource || resource.resource_type === 'LINK')
      throw new HttpException(
        AUTH404('Resource')[preferred_lang],
        HttpStatus.NOT_FOUND
      );
    const { resource_name, resource_ref } = resource;
    try {
      const file = createReadStream(
        join(process.cwd(), `uploads/${resource_ref}`)
      );
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${resource_name}`,
      });
      return new StreamableFile(file);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
