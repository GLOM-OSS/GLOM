import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../../../auth/auth.guard';
import { ChapterService } from './chapter.service';

@Controller('chapters')
@ApiTags('Courses/chapter')
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
}
