import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  CreateCourseSubjectDto,
  QueryCourseSubjectDto,
  SubjectEntity,
} from './subject.dto';
import { MetaParams } from '../../module';
import { generateShort } from '@glom/utils';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';

@Injectable()
export class CourseSubjectsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

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

  async create(
    {
      subject_code,
      subject_name,
      subjectParts,
      objective,
      weighting,
      annual_module_id,
    }: CreateCourseSubjectDto,
    metaParams: MetaParams,
    created_by: string
  ) {
    let subjectCode = subject_code;
    const subjectShort = generateShort(subject_name);
    if (!subjectCode || subjectCode === subjectShort)
      subjectCode = await this.codeGenerator.getSubjectCode(
        metaParams.school_id,
        subjectShort
      );
    const { AnnualSubjectParts: parts, ...subject } =
      await this.prismaService.annualSubject.create({
        include: {
          AnnualSubjectParts: {
            select: { number_of_hours: true, SubjectPart: true },
          },
        },
        data: {
          objective,
          weighting,
          subject_name,
          subject_code: subjectCode,
          AnnualModule: { connect: { annual_module_id } },
          CreatedBy: { connect: { annual_teacher_id: created_by } },
          AnnualSubjectParts: {
            createMany: {
              data: subjectParts.map((part) => ({ ...part, created_by })),
            },
          },
        },
      });
    return new SubjectEntity({
      ...subject,
      subjectParts: parts.map(
        ({
          SubjectPart: { subject_part_id, subject_part_name },
          number_of_hours,
        }) => ({ subject_part_id, subject_part_name, number_of_hours })
      ),
    });
  }
}
