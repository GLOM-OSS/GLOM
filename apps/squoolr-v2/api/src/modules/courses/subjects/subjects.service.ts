import { GlomPrismaService } from '@glom/prisma';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  CreateCourseSubjectDto,
  QueryCourseSubjectDto,
  SubjectEntity,
} from './subject.dto';
import { MetaParams } from '../../module';
import { generateShort } from '@glom/utils';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseSubjectsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(params?: QueryCourseSubjectDto) {
    const major = await this.prismaService.annualMajor.findFirstOrThrow({
      where: {
        AnnualClassrooms: {
          some: {
            AnnualModules: {
              some: { annual_module_id: params?.annual_module_id },
            },
          },
        },
      },
    });
    const subjects = await this.prismaService.annualSubject.findMany({
      include: {
        AnnualSubjectParts: {
          select: { number_of_hours: true, SubjectPart: true },
        },
        AnnualModule: !major?.uses_module_system
          ? {
              select: {
                credit_points: true,
                semester_number: true,
                annual_classroom_id: true,
              },
            }
          : undefined,
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
      ({ AnnualModule: courseModule, AnnualSubjectParts: parts, ...subject }) =>
        new SubjectEntity({
          ...subject,
          module: courseModule,
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
      module: courseModule,
    }: CreateCourseSubjectDto,
    metaParams: MetaParams,
    created_by: string
  ) {
    const { uses_module_system } =
      await this.prismaService.annualMajor.findFirstOrThrow({
        where: {
          AnnualClassrooms: {
            some: { AnnualModules: { some: { annual_module_id } } },
          },
        },
      });
    if (
      (uses_module_system && courseModule) ||
      (!uses_module_system && !courseModule)
    )
      throw new UnprocessableEntityException(
        `major teaching system constraint violated`
      );
    let subjectCode = subject_code;
    const subjectShort = generateShort(subject_name);
    if (!subjectCode || subjectCode === subjectShort)
      subjectCode = await this.codeGenerator.getSubjectCode(
        metaParams.school_id,
        subjectShort
      );
    let annualModule: Prisma.AnnualModuleCreateInput;
    if (courseModule) {
      const { annual_classroom_id, credit_points, semester_number } =
        courseModule;
      annualModule = {
        credit_points,
        semester_number,
        module_code: subjectCode,
        module_name: subject_name,
        AnnualClassroom: { connect: { annual_classroom_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
        AcademicYear: {
          connect: { academic_year_id: metaParams.academic_year_id },
        },
      };
    }

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
          AnnualModule: annualModule
            ? { create: annualModule }
            : { connect: { annual_module_id } },
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
