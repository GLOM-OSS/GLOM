import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys, generateShort } from '@glom/utils';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { MetaParams } from '../../module';
import {
  CreateCourseModuleDto,
  DisableCourseModuleDto,
  ModuleEntity,
  QueryCourseModuleDto,
  UpdateCourseModuleDto,
} from './module.dto';

@Injectable()
export class CourseModulesService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(params?: QueryCourseModuleDto) {
    const semesters = params?.semesters ?? [];
    const annualModules = await this.prismaService.annualModule.findMany({
      where: {
        is_deleted: params?.is_deleted ?? false,
        annual_classroom_id: params?.annual_classroom_id,
        semester_number:
          semesters.length > 0 ? { in: params?.semesters } : undefined,
        module_name: params?.keywords ? { search: params.keywords } : undefined,
        module_code: params?.keywords ? { search: params.keywords } : undefined,
      },
    });
    return annualModules.map((annualModule) => new ModuleEntity(annualModule));
  }

  async create(
    {
      annual_classroom_id,
      module_code,
      module_name,
      credit_points,
      semester_number,
    }: CreateCourseModuleDto,
    metaParams: MetaParams,
    created_by: string
  ) {
    let moduleCode = module_code;
    const moduleShort = generateShort(module_name);
    if (!moduleCode || moduleCode === moduleShort)
      moduleCode = await this.codeGenerator.getModuleCode(
        metaParams.school_id,
        moduleShort
      );

    const courseModule = await this.prismaService.annualModule.create({
      data: {
        module_name,
        credit_points,
        semester_number,
        module_code: moduleCode,
        is_subject_module: false,
        AnnualClassroom: { connect: { annual_classroom_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
        AcademicYear: {
          connect: { academic_year_id: metaParams.academic_year_id },
        },
      },
    });
    return new ModuleEntity(courseModule);
  }

  async update(
    annual_module_id: string,
    { disable, ...updatePayload }: UpdateCourseModuleDto,
    audited_by: string
  ) {
    const annualModuleAudit =
      await this.prismaService.annualModule.findFirstOrThrow({
        where: { annual_module_id },
      });
    await this.prismaService.annualModule.update({
      data: {
        ...updatePayload,
        is_deleted: disable,
        AnnualModuleAudits: {
          create: {
            ...excludeKeys(annualModuleAudit, [
              'annual_module_id',
              'academic_year_id',
              'annual_classroom_id',
              'created_at',
              'created_by',
            ]),
            AuditedBy: { connect: { annual_teacher_id: audited_by } },
          },
        },
        AnnualModuleHasSubjects: disable
          ? {
              updateMany: {
                data: { is_deleted: true },
                where: { annual_module_id },
              },
            }
          : undefined,
      },
      where: { annual_module_id },
    });
  }

  disable(annual_module_id: string, disable: boolean, audited_by: string) {
    return this.update(annual_module_id, { disable }, audited_by);
  }

  async disableMany(
    { annualModuleIds, disable }: DisableCourseModuleDto,
    audited_by: string
  ) {
    const annualModuleAudits = await this.prismaService.annualModule.findMany({
      where: { annual_module_id: { in: annualModuleIds } },
    });
    const prismaTransactions: PrismaPromise<Prisma.BatchPayload>[] = [
      this.prismaService.annualModule.updateMany({
        data: { is_deleted: disable },
        where: { annual_module_id: { in: annualModuleIds } },
      }),
      this.prismaService.annualModuleAudit.createMany({
        data: annualModuleAudits.map((annualModule) => ({
          ...excludeKeys(annualModule, [
            'academic_year_id',
            'annual_classroom_id',
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
          where: { annual_module_id: { in: annualModuleIds } },
        })
      );
    await this.prismaService.$transaction(prismaTransactions);
  }
}
