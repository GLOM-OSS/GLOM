import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AUTH404, ERR03, ERR04 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import {
  AnnualMajorPutDto,
  ClassroomPost,
  MajorPostDto,
  MajorQueryDto,
} from '../configurator.dto';

@Injectable()
export class MajorService {
  private cycleService: typeof this.prismaService.cycle;
  private classroomService: typeof this.prismaService.classroom;
  private departmentService: typeof this.prismaService.department;
  private annualMajorService: typeof this.prismaService.annualMajor;
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.cycleService = prismaService.cycle;
    this.classroomService = prismaService.classroom;
    this.annualMajorService = prismaService.annualMajor;
    this.departmentService = prismaService.department;
    this.annualClassroomService = prismaService.annualClassroom;
    this.annualClassroomDivisionService = prismaService.annualClassroomDivision;
  }

  async findAll(academic_year_id: string, where: MajorQueryDto) {
    const annualMajors = await this.annualMajorService.findMany({
      select: {
        major_acronym: true,
        major_code: true,
        major_name: true,
        Major: {
          select: {
            Cycle: {
              select: { cycle_name: true },
            },
          },
        },
        Department: {
          select: {
            department_acronym: true,
            department_code: true,
          },
        },
      },
      where: { ...where, academic_year_id },
    });

    return annualMajors.map(
      ({
        Major: {
          Cycle: { cycle_name },
        },
        Department: { department_acronym, department_code },
        ...major
      }) => ({ cycle_name, ...major, department_acronym, department_code })
    );
  }

  async findOne(major_code: string, academic_year_id: string) {
    const major = await this.annualMajorService.findUnique({
      select: {
        major_name: true,
        major_acronym: true,
        Major: {
          select: {
            cycle_id: true,
            Classrooms: {
              distinct: 'level',
              select: {
                level: true,
                AnnualClassrooms: {
                  take: 1,
                  select: {
                    registration_fee: true,
                    total_fee_due: true,
                  },
                  where: { academic_year_id },
                },
              },
            },
          },
        },
      },
      where: {
        major_code_academic_year_id: {
          major_code,
          academic_year_id,
        },
      },
    });
    if (!major)
      throw new HttpException(
        JSON.stringify(AUTH404('Major')),
        HttpStatus.NOT_FOUND
      );
    const {
      Major: { cycle_id, Classrooms },
      major_acronym,
      major_name,
    } = major;
    return {
      major_acronym,
      major_code,
      major_name,
      cycle_id,
      levelFees: Classrooms.map(({ level, AnnualClassrooms }) => ({
        level,
        registration_fee: AnnualClassrooms[0].registration_fee,
        total_fee_due: AnnualClassrooms[0].total_fee_due,
      })),
    };
  }

  async addNewMajor(
    {
      department_code,
      major_acronym,
      major_name,
      cycle_id,
      classrooms,
    }: MajorPostDto,
    academic_year_id: string,
    created_by: string
  ) {
    const cycle = await this.cycleService.findUnique({
      where: { cycle_id },
    });
    if (cycle?.number_of_years !== classrooms.length)
      throw new HttpException(
        JSON.stringify(ERR04),
        HttpStatus.PRECONDITION_FAILED
      );
    const department = await this.departmentService.findUnique({
      where: { department_code },
    });
    if (!department)
      throw new HttpException(
        JSON.stringify(AUTH404('Department')),
        HttpStatus.NOT_FOUND
      );
    const major = await this.annualMajorService.findFirst({
      where: { major_acronym, Department: { department_code } },
    });
    const major_code =
      major?.major_code ??
      (await this.codeGenerator.getMajorCode(major_acronym, department_code));

    const {
      annualClassroomDivisions,
      annualClassrooms,
      classrooms: classroomsData,
    } = await this.generateMajorClassrooms(
      { major_code, major_name, major_acronym, classrooms },
      academic_year_id,
      created_by
    );

    if (major)
      throw new HttpException(
        JSON.stringify(ERR03('Major')),
        HttpStatus.AMBIGUOUS
      );
    return this.prismaService.$transaction([
      this.annualMajorService.create({
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
                AnnualConfigurator: {
                  connect: { annual_configurator_id: created_by },
                },
                Classrooms: {
                  createMany: {
                    data: classroomsData,
                  },
                },
              },
              where: { major_code },
            },
          },
          Department: { connect: { department_code } },
          AcademicYear: { connect: { academic_year_id } },
          AnnualConfigurator: {
            connect: { annual_configurator_id: created_by },
          },
        },
      }),
      this.annualClassroomService.createMany({
        data: annualClassrooms,
      }),
      this.annualClassroomDivisionService.createMany({
        data: annualClassroomDivisions,
      }),
    ]);
  }

  async editMajor(
    major_code: string,
    updateData: AnnualMajorPutDto,
    academic_year_id: string,
    audited_by: string
  ) {
    const { major_acronym, major_name, department_code } = updateData;

    const annualMajorAudit = await this.annualMajorService.findFirst({
      select: {
        annual_major_id: true,
        major_acronym: true,
        major_code: true,
        major_name: true,
        is_deleted: true,
        department_id: true,
        Department: { select: { department_code: true } },
        Major: { select: { cycle_id: true } },
      },
      where: {
        academic_year_id,
        Major: { major_code },
      },
    });
    if (!annualMajorAudit)
      throw new HttpException(
        JSON.stringify(AUTH404('Major')),
        HttpStatus.NOT_FOUND
      );

    const { annual_major_id, Major, Department, ...majorAudit } =
      annualMajorAudit;
    let updateInput: Prisma.AnnualMajorUpdateInput = {
      major_name,
      AnnualMajorAudits: {
        create: {
          audited_by,
          ...majorAudit,
        },
      },
    };
    if (
      major_acronym !== annualMajorAudit.major_acronym ||
      department_code !== Department.department_code
    ) {
      const newMajorCode = await this.codeGenerator.getMajorCode(
        major_acronym,
        department_code
      );
      updateInput = {
        major_name,
        major_acronym,
        major_code: newMajorCode,
        Department: { connect: { department_code } },
        Major: {
          connectOrCreate: {
            create: {
              major_acronym,
              major_name,
              major_code: newMajorCode,
              Cycle: {
                connect: { cycle_id: Major.cycle_id },
              },
              AnnualConfigurator: {
                connect: { annual_configurator_id: audited_by },
              },
            },
            where: { major_code: newMajorCode },
          },
        },
      };
    }
    return this.annualMajorService.update({
      data: updateInput,
      where: { annual_major_id },
    });
  }

  async generateMajorClassrooms(
    major: {
      major_name: string;
      major_code: string;
      major_acronym: string;
      classrooms: ClassroomPost[];
    },
    academic_year_id: string,
    created_by: string
  ) {
    const { major_code, major_name, major_acronym, classrooms } = major;
    const classroomsData: Prisma.Enumerable<Prisma.ClassroomCreateManyMajorInput> =
      [];
    const annualClassrooms: Prisma.Enumerable<Prisma.AnnualClassroomCreateManyInput> =
      [];
    const annualClassroomDivisions: Prisma.Enumerable<Prisma.AnnualClassroomDivisionCreateManyInput> =
      [];
    // const alphabet = ['A', 'B', 'C', 'D']

    for (let i = 0; i < classrooms.length; i++) {
      const { level, registration_fee, total_fee_due } = classrooms[i];
      const classroom_acronym = `${major_acronym}${level}`;
      const numberOfClassrooms = await this.classroomService.count({
        where: { Major: { major_code } },
      });
      const classroom = {
        classroom_id: randomUUID(),
        classroom_acronym,
        classroom_code: `${classroom_acronym}${this.codeGenerator.getNumberString(
          numberOfClassrooms + 1
        )}`,
        classroom_name: `${major_name} ${level}`,
      };
      classroomsData.push({
        level,
        created_by,
        ...classroom,
      });
      const annual_classroom_id = randomUUID();
      annualClassrooms.push({
        ...classroom,
        total_fee_due,
        academic_year_id,
        registration_fee,
        annual_classroom_id,
      });
      annualClassroomDivisions.push({
        division_letter: 'A',
        annual_classroom_id,
        created_by,
      });
    }
    return {
      classrooms: classroomsData,
      annualClassrooms,
      annualClassroomDivisions,
    };
  }
}
