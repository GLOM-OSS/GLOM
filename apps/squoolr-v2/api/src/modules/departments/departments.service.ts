import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { QueryParamsDto } from '../modules.dto';
import { CreateDepartmentInput, UpdateDepartmentInput } from './department';
import { DepartmentEntity, UpdateDepartmentDto } from './department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(school_id: string, params?: QueryParamsDto) {
    const departments = await this.prismaService.department.findMany({
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
    return departments.map((department) => new DepartmentEntity(department));
  }

  async create(payload: CreateDepartmentInput, created_by: string) {
    const { school_id, department_acronym, department_name } = payload;
    const departmentCode = await this.codeGenerator.getDepartmentCode(
      department_acronym,
      school_id
    );
    const department = await this.prismaService.department.create({
      data: {
        department_name,
        department_acronym,
        department_code: departmentCode,
        School: { connect: { school_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: created_by } },
      },
    });
    return new DepartmentEntity(department);
  }

  async update(
    department_id: string,
    payload: UpdateDepartmentInput,
    audited_by: string
  ) {
    const departmentAudit =
      await this.prismaService.department.findUniqueOrThrow({
        select: {
          is_deleted: true,
          department_name: true,
        },
        where: { department_id },
      });
    await this.prismaService.department.update({
      data: {
        ...payload,
        DepartmentAudits: {
          create: {
            audited_by,
            ...departmentAudit,
          },
        },
      },
      where: { department_id },
    });
  }
}
