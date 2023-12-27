import { GlomPrismaService } from '@glom/prisma';
import { pickKeys } from '@glom/utils';
import { QueryCourseDto } from '../course.dto';
import {
  ChapterEntity,
  CreateChapterDto,
  UpdateChapterDto,
} from './chapter.dto';
import { UnprocessableEntityException } from '@nestjs/common';

export class ChaptersService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseDto) {
    const chapters = await this.prismaService.chapter.findMany({
      orderBy: { chapter_position: 'desc' },
      where: {
        is_deleted: params?.is_deleted ?? false,
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

  async create(
    {
      annual_subject_id,
      parent_chapter_id,
      ...chapterPayload
    }: CreateChapterDto,
    created_by: string
  ) {
    const chapterCount = await this.prismaService.chapter.count({
      where: { annual_subject_id, parent_chapter_id, is_deleted: false },
    });
    if (parent_chapter_id && (await getChapterLevel(parent_chapter_id)) >= 3)
      throw new UnprocessableEntityException(
        'Chapter part must not be more than two level nested'
      );
    const newChapter = await this.prismaService.chapter.create({
      data: {
        ...chapterPayload,
        chapter_position: chapterCount + 1,
        AnnualSubject: { connect: { annual_subject_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
        ParentChapter: { connect: { chapter_id: parent_chapter_id } },
      },
    });
    return new ChapterEntity(newChapter);

    async function getChapterLevel(chapter_id: string, level = 1) {
      const { parent_chapter_id } =
        await this.prismaService.chapter.findFirstOrThrow({
          where: { chapter_id },
        });
      if (parent_chapter_id) getChapterLevel(parent_chapter_id, level + 1);
      else return level;
    }
  }

  async update(
    chapter_id: string,
    updatePayload: UpdateChapterDto & { is_deleted?: boolean },
    audited_by: string
  ) {
    const chapterAudit = await this.prismaService.chapter.findUniqueOrThrow({
      where: { chapter_id },
    });
    await this.prismaService.chapter.update({
      data: {
        ...updatePayload,
        ChapterAudits: {
          create: {
            ...pickKeys(chapterAudit, [
              'is_deleted',
              'chapter_title',
              'chapter_objective',
              'chapter_position',
            ]),
            AuditedBy: { connect: { annual_teacher_id: audited_by } },
          },
        },
      },
      where: { chapter_id },
    });
  }

  async delete(chapter_id: string, is_deleted: boolean, deleted_by: string) {
    const chapters = await this.prismaService.chapter.findMany({
      where: { OR: [{ chapter_id }, { parent_chapter_id: chapter_id }] },
    });
    await this.prismaService.$transaction([
      this.prismaService.chapter.updateMany({
        data: { is_deleted },
        where: { OR: [{ chapter_id }, { parent_chapter_id: chapter_id }] },
      }),
      this.prismaService.chapterAudit.createMany({
        data: chapters.map((chapter) => ({
          ...pickKeys(chapter, [
            'is_deleted',
            'chapter_id',
            'chapter_title',
            'chapter_objective',
            'chapter_position',
          ]),
          audited_by: deleted_by,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
