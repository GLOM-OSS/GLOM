import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { DepartmentPostDto, DepartmentPutDto } from '../configurator.dto';

@Injectable()
export class DepartmentService {
  private schoolService: typeof this.prismaService.school;
  private departmentService: typeof this.prismaService.department;
  private majorService: typeof this.prismaService.major;
  private annualMajorService: typeof this.prismaService.annualMajor;
  private annualMajorAuditService: typeof this.prismaService.annualMajorAudit;
  private classroomService: typeof this.prismaService.classroom;
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  private annualClassroomAuditService: typeof this.prismaService.annualClassroomAudit;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;
  private annualClassroomDivisionAuditService: typeof this.prismaService.annualClassroomDivisionAudit;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.schoolService = this.prismaService.school;
    this.departmentService = this.prismaService.department;
    this.majorService = this.prismaService.major;
    this.annualMajorService = this.prismaService.annualMajor;
    this.annualMajorAuditService = this.prismaService.annualMajorAudit;
    this.classroomService = this.prismaService.classroom;
    this.annualClassroomService = this.prismaService.annualClassroom;
    this.annualClassroomAuditService = this.prismaService.annualClassroomAudit;
    this.annualClassroomDivisionService =
      this.prismaService.annualClassroomDivision;
    this.annualClassroomDivisionAuditService =
      this.prismaService.annualClassroomDivisionAudit;
  }

  async findAllDepartments(
    school_id: string,
    { archived }: { archived?: boolean }
  ) {
    return this.departmentService.findMany({
      select: {
        is_deleted: true,
        created_at: true,
        department_code: true,
        department_name: true,
        department_acronym: true,
      },
      where: { is_deleted: archived, school_id },
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

  async toogleArchive(department_code: string, audited_by: string) {
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
      select: {
        department_code: true,
        is_deleted: true,
        school_id: true,
      },
      data: {
        is_deleted: !departmentAudit.is_deleted,
        DepartmentAudits: {
          create: { ...departmentAudit, audited_by },
        },
      },
      where: { department_code },
    });
  }
}
