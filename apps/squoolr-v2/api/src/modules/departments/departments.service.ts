import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { QueryParamsDto } from '../modules.dto';
import { CreateDepartmentPayload, UpdateDepartmentPayload } from './department';
import { DepartmentEntity } from './department.dto';
import { MajorsService } from '../majors/majors.service';

@Injectable()
export class DepartmentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private majorsService: MajorsService
  ) {}

  async findAll(school_id: string, params?: QueryParamsDto) {
    const departments = await this.prismaService.department.findMany({
      where: {
        school_id,
        is_deleted: params?.is_deleted ?? false,
        department_name: params?.keywords
          ? {
              search: params?.keywords,
            }
          : undefined,
      },
    });
    return departments.map((department) => new DepartmentEntity(department));
  }

  async create(
    { school_id, ...departmentData }: CreateDepartmentPayload,
    created_by: string
  ) {
    const department = await this.prismaService.department.create({
      data: {
        ...departmentData,
        School: { connect: { school_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: created_by } },
      },
    });
    return new DepartmentEntity(department);
  }

  async update(
    department_id: string,
    payload: UpdateDepartmentPayload,
    audited_by: string
  ) {
    const { AnnualMajors: annualMajors, ...departmentAudit } =
      await this.prismaService.department.findFirstOrThrow({
        select: {
          is_deleted: true,
          department_name: true,
          department_acronym: true,
          AnnualMajors: true,
        },
        where: { department_id, is_deleted: false },
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
    if (payload?.is_deleted)
      await this.majorsService.disableMany(
        annualMajors.map((_) => _.annual_major_id),
        payload.is_deleted,
        audited_by
      );
  }

  async disableMany(departmentIds: string[], disabled_by: string) {
    await Promise.all(
      departmentIds.map((departmentId) =>
        this.update(departmentId, { is_deleted: true }, disabled_by)
      )
    );
  }
}
