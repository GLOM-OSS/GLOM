import { GlomPrismaService } from '@glom/prisma';
import { QueryCourseDto } from '../course.dto';
import { ChapterEntity } from './chapter.dto';

export class ChaptersService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseDto) {
    const chapters = await this.prismaService.chapter.findMany({
      orderBy: { chapter_position: 'desc' },
      where: {
        is_deleted: params?.is_deleted,
        annual_subject_id: params?.annual_subject_id,
        parent_chapter_id: params?.parent_chapter_id ?? null,
        ...(params
          ? {
              chapter_title: { search: params?.keywords },
              chapter_objective: { search: params?.keywords },
            }
          : {}),
      },
    });
    return chapters.map((chapter) => new ChapterEntity(chapter));
  }

  async findOne(chapter_id: string) {
    const chapter = await this.prismaService.chapter.findFirst({
      where: { chapter_id, is_deleted: false },
    });
    return new ChapterEntity(chapter);
  }
}
