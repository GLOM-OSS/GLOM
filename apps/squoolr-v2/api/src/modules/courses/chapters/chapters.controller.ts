import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  ChapterEntity,
  CreateChapterDto,
  UpdateChapterDto,
} from './chapter.dto';
import { ChaptersService } from './chapters.service';

@ApiTags('Course chapters')
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
  @ApiCreatedResponse({ type: ChapterEntity })
  createChapter(@Req() request: Request, @Body() newChapter: CreateChapterDto) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.chaptersService.create(newChapter, annual_teacher_id);
  }

  @Put(':chapter_id')
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
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

  @Delete(':chapter_id')
  @Roles(Role.TEACHER)
  @ApiNoContentResponse()
  deleteChapter(
    @Req() request: Request,
    @Param('chapter_id') chapterId: string,
    @Query('is_deleted', ParseBoolPipe) isDeleted: boolean
  ) {
    const {
      annualTeacher: { annual_teacher_id },
    } = request.user;
    return this.chaptersService.delete(chapterId, isDeleted, annual_teacher_id);
  }
}
