import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryCourseSubjectDto, SubjectEntity } from './subject.dto';

@Injectable()
export class CourseSubjectsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(params?: QueryCourseSubjectDto) {
    const subjects = await this.prismaService.annualSubject.findMany({
      include: {
        AnnualSubjectParts: {
          select: { number_of_hours: true, SubjectPart: true },
        },
      },
      where: {
        is_deleted: params?.is_deleted,
        annual_module_id: params?.annual_module_id,
        subject_name: params?.keywords
          ? { search: params.keywords }
          : undefined,
        subject_code: params?.keywords
          ? { search: params.keywords }
          : undefined,
      },
    });
    return subjects.map(
      ({ AnnualSubjectParts: parts, ...subject }) =>
        new SubjectEntity({
          ...subject,
          subjectParts: parts.map(
            ({
              SubjectPart: { subject_part_id, subject_part_name },
              number_of_hours,
            }) => ({ subject_part_id, subject_part_name, number_of_hours })
          ),
        })
    );
  }
}
