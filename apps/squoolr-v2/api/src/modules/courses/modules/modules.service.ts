import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryCourseDto } from '../course.dto';
import { CreateCourseModuleInput, UpdateCourseModuleInput } from './module';
import { CourseModuleEntity } from './module.dto';
import { CodeGeneratorFactory } from '../../../helpers/code-generator.factory';
import { excludeKeys, generateShort } from '@glom/utils';

@Injectable()
export class CourseModulesService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(params?: QueryCourseDto) {
    const semesters = params?.semesters ?? [];
    const annualModules = await this.prismaService.annualModule.findMany({
      where: {
        is_deleted: params?.is_deleted,
        annual_classroom_id: params?.annual_classroom_id,
        semester_number:
          semesters.length > 0 ? { in: params?.semesters } : undefined,
      },
    });
    return annualModules.map(
      (annualModule) => new CourseModuleEntity(annualModule)
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
    if (!moduleCode)
      moduleCode = await this.codeGenerator.getModuleCode(
        school_id,
        generateShort(module_name)
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
    return new CourseModuleEntity(courseModule);
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
