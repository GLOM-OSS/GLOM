import { GlomPrismaService } from '@glom/prisma';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  CreateCourseSubjectDto,
  CreateModuleNestedDto,
  DisableCourseSubjectDto,
  QueryCourseSubjectDto,
  SubjectEntity,
  UpdateCourseSubjectDto,
} from './subject.dto';
import { MetaParams } from '../../module';
import { excludeKeys, generateShort } from '@glom/utils';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { AnnualMajor, Prisma, PrismaPromise } from '@prisma/client';

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
    if (courseModule) await this.validateInput(courseModule);

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
        is_subject_module: true,
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

  private async validateInput(courseModule: CreateModuleNestedDto) {
    const major = await this.prismaService.annualMajor.findFirstOrThrow({
      where: {
        AnnualClassrooms: {
          some: { annual_classroom_id: courseModule.annual_classroom_id },
        },
      },
    });
    if (
      (major.uses_module_system && courseModule) ||
      (!major.uses_module_system && !courseModule)
    )
      throw new UnprocessableEntityException(
        `major teaching system constraint violated`
      );
    return major;
  }

  async update(
    annual_subject_id: string,
    {
      disable,
      module: courseModule,
      subjectParts,
      ...updatePayload
    }: UpdateCourseSubjectDto,
    audited_by: string
  ) {
    if (courseModule) await this.validateInput(courseModule);
    const {
      AnnualModule: annualModule,
      AnnualSubjectParts: annualSubjectParts,
      ...annualSubjectAudit
    } = await this.prismaService.annualSubject.findUniqueOrThrow({
      include: {
        AnnualSubjectParts: !!subjectParts,
        AnnualModule: !!courseModule,
      },
      where: { annual_subject_id },
    });
    await this.prismaService.$transaction([
      this.prismaService.annualSubject.update({
        data: {
          ...updatePayload,
          is_deleted: disable,
          AnnualSubjectParts: {
            updateMany: {
              data: subjectParts,
              where: {
                annual_subject_id: {
                  in: subjectParts.map((_) => _.subject_part_id),
                },
              },
            },
          },
          AnnualModule: courseModule
            ? {
                update: {
                  ...courseModule,
                  module_name: updatePayload?.subject_name,
                  module_code: updatePayload?.subject_code,
                  AnnualModuleAudits: {
                    create: {
                      ...excludeKeys(annualModule, [
                        'academic_year_id',
                        'annual_classroom_id',
                        'annual_module_id',
                        'created_at',
                        'created_by',
                      ]),
                      AuditedBy: { connect: { annual_teacher_id: audited_by } },
                    },
                  },
                },
              }
            : undefined,
          AnnualSubjectAudits:
            typeof disable === 'boolean' ||
            Object.keys(updatePayload).length > 0
              ? {
                  create: {
                    ...excludeKeys(annualSubjectAudit, [
                      'annual_module_id',
                      'annual_subject_id',
                      'created_at',
                      'created_by',
                    ]),
                    AuditedBy: { connect: { annual_teacher_id: audited_by } },
                  },
                }
              : undefined,
        },
        where: { annual_subject_id },
      }),
      this.prismaService.annualSubjectPartAudit.createMany({
        data: annualSubjectParts.map(
          ({ number_of_hours, annual_subject_part_id }) => ({
            number_of_hours,
            annual_subject_part_id,
            audited_by,
          })
        ),
      }),
    ]);
  }

  disable(annual_module_id: string, disable: boolean, audited_by: string) {
    return this.update(annual_module_id, { disable }, audited_by);
  }

  async disableMany(
    { annualSubjectIds, disable }: DisableCourseSubjectDto,
    audited_by: string
  ) {
    const annualSubjectAudits = await this.prismaService.annualSubject.findMany(
      {
        where: { annual_subject_id: { in: annualSubjectIds } },
      }
    );
    const prismaTransactions: PrismaPromise<Prisma.BatchPayload>[] = [
      this.prismaService.annualSubject.updateMany({
        data: { is_deleted: disable },
        where: { annual_subject_id: { in: annualSubjectIds } },
      }),
      this.prismaService.annualSubjectAudit.createMany({
        data: annualSubjectAudits.map((annualSubject) => ({
          ...excludeKeys(annualSubject, [
            'annual_module_id',
            'created_at',
            'created_by',
          ]),
          audited_by,
        })),
      }),
    ];
    if (disable)
      prismaTransactions.push(
        this.prismaService.annualSubject.updateMany({
          data: { is_deleted: true },
          where: { annual_subject_id: { in: annualSubjectIds } },
        })
      );
    await this.prismaService.$transaction(prismaTransactions);
  }
}
