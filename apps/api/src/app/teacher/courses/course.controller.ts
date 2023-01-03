import {
  Body,
  Controller, Get,
  HttpException,
  HttpStatus, Param, Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../utils/types';
import { AuthenticatedGuard } from '../../auth/auth.guard';
import { LinkPostDto, ResourceOwner } from './course.dto';
import { CourseService } from './course.service';

@Controller()
@UseGuards(AuthenticatedGuard)
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('all')
  async getCourses(@Req() request: Request) {
    const {
      activeYear: { academic_year_id },
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    return this.courseService.findAll(academic_year_id, annual_teacher_id);
  }

  @Get(':annual_credit_unit_subject_id')
  async getCourse(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findOne(annual_credit_unit_subject_id);
  }

  @Get(':annual_credit_unit_subject_id/resources')
  async getResources(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findResources(annual_credit_unit_subject_id);
  }

  @Get(':annual_credit_unit_subject_id/chapters')
  async getCourseChapters(
    @Param('annual_credit_unit_subject_id')
    annual_credit_unit_subject_id: string
  ) {
    return this.courseService.findChapters(annual_credit_unit_subject_id);
  }

  @Post('resources/new-link')
  async addNewLink(@Req() request: Request, @Body() newLink: LinkPostDto) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.courseService.createResource(
        'LINK',
        [newLink],
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('resources/new-files')
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
      return this.courseService.createResource(
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
