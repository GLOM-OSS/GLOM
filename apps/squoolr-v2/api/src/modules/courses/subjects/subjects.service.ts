import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys, generateShort, pickKeys } from '@glom/utils';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { MetaParams } from '../../module';
import { SubjectArgsFactory } from './subject-args.factory';
import {
  CreateCourseSubjectDto,
  CreateModuleNestedDto,
  DisableCourseSubjectDto,
  QueryCourseSubjectDto,
  UpdateCourseSubjectDto,
} from './subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(params?: QueryCourseSubjectDto) {
    const subjects = await this.prismaService.annualModuleHasSubject.findMany({
      ...SubjectArgsFactory.getSelectArgs(),
      where: {
        is_deleted: params?.is_deleted ?? false,
        annual_module_id: params?.annual_module_id,
        AnnualSubject: params?.keywords
          ? {
              subject_name: params?.keywords
                ? { search: params.keywords }
                : undefined,
              subject_code: params?.keywords
                ? { search: params.keywords }
                : undefined,
            }
          : undefined,
      },
    });
    return subjects.map((subject) =>
      SubjectArgsFactory.getSubjectEntity(subject)
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

    const subject = await this.prismaService.annualModuleHasSubject.create({
      ...SubjectArgsFactory.getSelectArgs(),
      data: {
        objective,
        weighting,
        AnnualSubject: {
          connectOrCreate: {
            create: {
              subject_name,
              subject_code: subjectCode,
              AcademicYear: {
                connect: { academic_year_id: metaParams.academic_year_id },
              },
              CreatedBy: { connect: { annual_teacher_id: created_by } },
              AnnualSubjectParts: {
                createMany: {
                  data: subjectParts.map((part) => ({
                    ...part,
                    created_by,
                  })),
                },
              },
            },
            where: {
              subject_code_academic_year_id: {
                academic_year_id: metaParams.academic_year_id,
                subject_code,
              },
            },
          },
        },
        AnnualModule: annualModule
          ? { create: annualModule }
          : { connect: { annual_module_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
      },
    });
    return SubjectArgsFactory.getSubjectEntity(subject);
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
    annual_module_has_subject_id: string,
    {
      disable,
      module: courseModule,
      subjectParts,
      objective,
      weighting,
      subject_name,
    }: UpdateCourseSubjectDto,
    audited_by: string
  ) {
    if (courseModule) await this.validateInput(courseModule);
    const {
      AnnualModule: annualModule,
      AnnualSubject: { AnnualSubjectParts: annualSubjectParts },
      ...annualSubjectAudit
    } = await this.prismaService.annualModuleHasSubject.findUniqueOrThrow({
      include: {
        AnnualSubject: { include: { AnnualSubjectParts: !!subjectParts } },
        AnnualModule: !!courseModule,
      },
      where: { annual_module_has_subject_id },
    });
    await this.prismaService.$transaction([
      this.prismaService.annualModuleHasSubject.update({
        data: {
          objective,
          weighting,
          is_deleted: disable,
          AnnualSubject:
            subject_name || subjectParts.length > 0
              ? {
                  update: {
                    subject_name,
                    AnnualSubjectParts:
                      subjectParts.length > 0
                        ? {
                            updateMany: {
                              data: subjectParts,
                              where: {
                                annual_subject_id: {
                                  in: subjectParts.map(
                                    (_) => _.subject_part_id
                                  ),
                                },
                              },
                            },
                          }
                        : undefined,
                    AnnualSubjectAudits: subject_name
                      ? {
                          create: {
                            subject_name,
                            AuditedBy: {
                              connect: { annual_teacher_id: audited_by },
                            },
                          },
                        }
                      : undefined,
                  },
                }
              : undefined,
          AnnualModule: courseModule
            ? {
                update: {
                  ...courseModule,
                  module_name: subject_name,
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
          AnnualModuleHasSubjectAudits:
            typeof disable === 'boolean' || objective || weighting
              ? {
                  create: {
                    ...pickKeys(annualSubjectAudit, [
                      'is_deleted',
                      'objective',
                      'weighting',
                    ]),
                    AuditedBy: { connect: { annual_teacher_id: audited_by } },
                  },
                }
              : undefined,
        },
        where: { annual_module_has_subject_id },
      }),
      this.prismaService.annualSubjectPartAudit.createMany({
        data: annualSubjectParts.map(
          ({ number_of_hours, annual_subject_part_id, annual_teacher_id }) => ({
            number_of_hours,
            annual_subject_part_id,
            annual_teacher_id,
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
    const annualSubjectAudits =
      await this.prismaService.annualModuleHasSubject.findMany({
        where: { annual_module_has_subject_id: { in: annualSubjectIds } },
      });
    const prismaTransactions: PrismaPromise<Prisma.BatchPayload>[] = [
      this.prismaService.annualModuleHasSubject.updateMany({
        data: { is_deleted: disable },
        where: { annual_subject_id: { in: annualSubjectIds } },
      }),
      this.prismaService.annualModuleHasSubjectAudit.createMany({
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
        this.prismaService.annualModuleHasSubject.updateMany({
          data: { is_deleted: true },
          where: { annual_subject_id: { in: annualSubjectIds } },
        })
      );
    await this.prismaService.$transaction(prismaTransactions);
  }
}
