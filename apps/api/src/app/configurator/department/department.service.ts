import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { DepartmentPostDto, DepartmentPutDto } from '../configurator.dto';

@Injectable()
export class DepartmentService {
  private departmentService: typeof this.prismaService.department;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.departmentService = prismaService.department;
  }

  async findAllDepartments(
    school_id: string,
    { is_deleted }: { is_deleted?: boolean }
  ) {
    return this.departmentService.findMany({
      select: {
        is_deleted: true,
        created_at: true,
        department_code: true,
        department_name: true,
        department_acronym: true,
      },
      where: { is_deleted, school_id },
    });
  }

  async addNewDepartment(
    school_id: string,
    newDepartment: DepartmentPostDto,
    created_by: string
  ) {
    const { department_acronym, department_name } = newDepartment;
    return this.departmentService.create({
      data: {
        department_acronym,
        department_name,
        department_code: await this.codeGenerator.getDepartmentCode(
          department_acronym,
          school_id
        ),
        School: { connect: { school_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: created_by } },
      },
    });
  }

  async editDepartment(
    department_code: string,
    data: DepartmentPutDto,
    audited_by: string
  ) {
    const departmentAudit = await this.departmentService.findUnique({
      select: {
        is_deleted: true,
        department_name: true,
      },
      where: { department_code },
    });
    if (!departmentAudit)
      throw new HttpException(
        JSON.stringify(AUTH404('Department')),
        HttpStatus.NOT_FOUND
      );
    return this.departmentService.update({
      data: {
        ...data,
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
