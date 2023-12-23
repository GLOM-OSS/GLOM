import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChapterEntity } from './chapter.dto';
import { QueryCourseDto } from '../course.dto';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';

@ApiTags('Chapters')
@Controller('courses/chapters')
@UseGuards(AuthenticatedGuard)
export class ChaptersController {
  constructor(private chaptersService: ChaptersService) {}

  @Get()
  @ApiOkResponse({ type: [ChapterEntity] })
  getChapters(@Query() params?: QueryCourseDto) {
    return this.chaptersService.findAll(params);
  }
}
