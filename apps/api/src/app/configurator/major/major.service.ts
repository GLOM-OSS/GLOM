import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { MajorPostDto, MajorQueryDto } from '../configurator.dto';

@Injectable()
export class MajorService {
  private annualMajorService: typeof this.prismaService.annualMajor;
  private departmentService: typeof this.prismaService.department;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.departmentService = this.prismaService.department;
    this.annualMajorService = this.prismaService.annualMajor;
  }

  async findAll({ archived, ...where }: MajorQueryDto) {
    return this.annualMajorService.findMany({
      where: { ...where, is_deleted: archived },
    });
  }

  async addNewMajor(
    { department_code, major_acronym, major_name, cycle_id }: MajorPostDto,
    academic_year_id: string,
    annual_configurator_id: string
  ) {
    const major_code = await this.codeGenerator.getMajorCode(
      major_acronym,
      department_code
    );
    return this.annualMajorService.create({
      data: {
        major_name,
        major_acronym,
        major_code,
        Major: {
          connectOrCreate: {
            create: {
              major_acronym,
              major_code,
              major_name,
              Cycle: { connect: { cycle_id } },
              AnnualConfigurator: { connect: { annual_configurator_id } },
            },
            where: { major_code },
          },
        },
        Department: { connect: { department_code } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualConfigurator: { connect: { annual_configurator_id } },
      },
    });
  }
}
