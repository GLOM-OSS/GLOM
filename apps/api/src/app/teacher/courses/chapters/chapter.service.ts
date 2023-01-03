import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';

@Injectable()
export class ChapterService {
  constructor(private prismaService: PrismaService) {}

  async findOne(chapter_id: string) {
    return this.prismaService.chapter.findUnique({
      select: {
        chapter_title: true,
        chapter_objective: true,
        annual_credit_unit_subject_id: true,
        chapter_number: true,
        chapter_parent_id: true,
      },
      where: { chapter_id },
    });
  }

  async findResources(chapter_id: string) {
    return this.prismaService.resource.findMany({
      select: {
        resource_id: true,
        chapter_id: true,
        resource_type: true,
        resource_extension: true,
        annual_credit_unit_subject_id: true,
      },
      where: { chapter_id, is_deleted: false },
    });
  }

  async findChapterParts(chapter_parent_id: string) {
    return this.prismaService.chapter.findMany({
      select: {
        chapter_title: true,
        chapter_objective: true,
        annual_credit_unit_subject_id: true,
        chapter_number: true,
        chapter_parent_id: true,
      },
      where: { chapter_parent_id, is_deleted: false },
    });
  }
}
