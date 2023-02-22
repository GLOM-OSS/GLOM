import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData, Role } from '../../../../utils/types';
import { Roles } from '../../../app.decorator';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { ChapterPostDto, ChapterPutDto } from '../course.dto';
import { ChapterService } from './chapter.service';
@ApiTags('Chapters')
@Controller('chapters')
@UseGuards(AuthenticatedGuard)
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Get(':chapter_id')
  async getChapter(@Param('chapter_id') chapter_id: string) {
    return this.chapterService.findOne(chapter_id);
  }

  @Get(':chapter_id/parts')
  async getChapterParts(@Param('chapter_id') chapter_id: string) {
    return this.chapterService.findChapterParts(chapter_id);
  }

  @Get(':chapter_id/resources')
  async getChapterResources(@Param('chapter_id') chapter_id: string) {
    return this.chapterService.findResources(chapter_id);
  }

  @Get(':chapter_id/assessment')
  async getChapterAssessment(
    @Req() request: Request,
    @Param('chapter_id') chapter_id: string
  ) {
    const { annualStudent } = request.user as DeserializeSessionData;
    return this.chapterService.findChapterAssessment(
      chapter_id,
      Boolean(annualStudent)
    );
  }

  @Post('new')
  @Roles(Role.TEACHER)
  async createNewChapter(
    @Req() request: Request,
    @Body() newChapter: ChapterPostDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      return this.chapterService.create(newChapter, annual_teacher_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':chpater_id/edit')
  @Roles(Role.TEACHER)
  async updateChapter(
    @Req() request: Request,
    @Param('chapter_id') chapter_id: string,
    @Body() updatedData: ChapterPutDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.chapterService.update(
        chapter_id,
        updatedData,
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':chpater_id/delete')
  @Roles(Role.TEACHER)
  async deleteChapter(
    @Req() request: Request,
    @Param('chapter_id') chapter_id: string
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user as DeserializeSessionData;
    try {
      await this.chapterService.update(
        chapter_id,
        { is_deleted: true },
        annual_teacher_id
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
