import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { QueryParamsDto } from '../modules.dto';
import { DepartmentCreateInput } from './department';
import { UpdateDepartmentDto } from './department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(school_id: string, params?: QueryParamsDto) {
    return this.prismaService.department.findMany({
      select: {
        is_deleted: true,
        created_at: true,
        department_code: true,
        department_name: true,
        department_acronym: true,
      },
      where: {
        school_id,
        is_deleted: params?.is_deleted,
        department_name: params?.keywords
          ? {
              search: params?.keywords,
            }
          : undefined,
      },
    });
  }

  async create(payload: DepartmentCreateInput, created_by: string) {
    const { school_id, department_acronym, department_name } = payload;
    const departmentCode = await this.codeGenerator.getDepartmentCode(
      department_acronym,
      school_id
    );
    return this.prismaService.department.create({
      data: {
        department_name,
        department_acronym,
        department_code: departmentCode,
        School: { connect: { school_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: created_by } },
      },
    });
  }

  async update(
    department_code: string,
    payload: UpdateDepartmentDto,
    audited_by: string
  ) {
    const departmentAudit =
      await this.prismaService.department.findUniqueOrThrow({
        select: {
          is_deleted: true,
          department_name: true,
        },
        where: { department_code },
      });
    return this.prismaService.department.update({
      data: {
        ...payload,
        DepartmentAudits: {
          create: {
            audited_by,
            ...departmentAudit,
          },
        },
      },
      where: { department_code },
    });
  }
}
