import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ChapterEntity,
  CreateChapterDto,
  UpdateChapterDto,
} from './chapter.dto';
import { QueryCourseDto } from '../course.dto';
import { AuthenticatedGuard } from '../../../app/auth/auth.guard';
import { Request } from 'express';
import { Roles } from '../../../app/auth/auth.decorator';
import { Role } from '../../../utils/enums';

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

  @Get(':chapter_id')
  @ApiOkResponse({ type: ChapterEntity })
  getChapter(@Param() chapterId: string) {
    return this.chaptersService.findOne(chapterId);
  }

  @Post('new')
  @Roles(Role.TEACHER)
  @ApiOkResponse({ type: ChapterEntity })
  createChapter(@Req() request: Request, @Body() newChapter: CreateChapterDto) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.chaptersService.create(newChapter, annual_teacher_id);
  }

  @Put(':chapter_id')
  @Roles(Role.TEACHER)
  @ApiOkResponse({ type: ChapterEntity })
  updateChapter(
    @Req() request: Request,
    @Param('chapter_id') chapterId: string,
    @Body() updatePayload: UpdateChapterDto
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.chaptersService.update(
      chapterId,
      updatePayload,
      annual_teacher_id
    );
  }
}
