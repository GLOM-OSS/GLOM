import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryCourseModuleDto } from './module.dto';
import { CreateCourseModuleInput, UpdateCourseModuleInput } from './module';
import { ModuleEntity } from './module.dto';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { excludeKeys, generateShort } from '@glom/utils';

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
        is_deleted: params?.is_deleted,
        annual_classroom_id: params?.annual_classroom_id,
        semester_number:
          semesters.length > 0 ? { in: params?.semesters } : undefined,
        module_name: params?.keywords ? { search: params.keywords } : undefined,
        module_code: params?.keywords ? { search: params.keywords } : undefined,
      },
    });
    return annualModules.map(
      (annualModule) => new ModuleEntity(annualModule)
    );
  }

  async create(
    {
      annual_classroom_id,
      academic_year_id,
      module_code,
      school_id,
      module_name,
      credit_points,
      semester_number,
    }: CreateCourseModuleInput,
    created_by: string
  ) {
    let moduleCode = module_code;
    const moduleShort = generateShort(module_name);
    if (!moduleCode || moduleCode === moduleShort)
      moduleCode = await this.codeGenerator.getModuleCode(
        school_id,
        moduleShort
      );

    const courseModule = await this.prismaService.annualModule.create({
      data: {
        module_name,
        credit_points,
        semester_number,
        module_code: moduleCode,
        AnnualClassroom: { connect: { annual_classroom_id } },
        CreatedBy: { connect: { annual_teacher_id: created_by } },
        AcademicYear: { connect: { academic_year_id } },
      },
    });
    return new ModuleEntity(courseModule);
  }

  async update(
    annual_module_id: string,
    { disable, ...updatePayload }: UpdateCourseModuleInput,
    audited_by: string
  ) {
    const { annual_classroom_id, ...annualModuleAudit } =
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
              'created_at',
              'created_by',
            ]),
            AnnualClassroom: { connect: { annual_classroom_id } },
            AuditedBy: { connect: { annual_teacher_id: audited_by } },
          },
        },
      },
      where: { annual_module_id },
    });
  }
}
