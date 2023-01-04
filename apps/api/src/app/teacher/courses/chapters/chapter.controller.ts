import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DeserializeSessionData } from '../../../../utils/types';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { ChapterPostDto } from '../course.dto';
import { ChapterService } from './chapter.service';
@ApiTags('Chapters')
@Controller('chapters')
@UseGuards(AuthenticatedGuard)
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Get(':chapter_id')
  async getChapters(@Param('chapter_id') chapter_id: string) {
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
  async getChapterAssessment(@Param('chapter_id') chapter_id: string) {
    return this.chapterService.findChapterAssessment(chapter_id);
  }

  @Post('new')
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
}
