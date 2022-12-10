import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcademicYear, AcademicYearStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AUTH404, ERR05 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { ActiveYear } from '../../../utils/types';
import { AcademicYearPostDto, TemplateYearPostDto } from '../configurator.dto';

type AcademicYearObject = { AcademicYear: AcademicYear };

@Injectable()
export class AcademicYearService {
  private annualMajorService: typeof this.prismaService.annualMajor;
  private academicYearService: typeof this.prismaService.academicYear;
  private annualTeacherService: typeof this.prismaService.annualTeacher;
  private annualStudentService: typeof this.prismaService.annualStudent;
  private annualRegistryService: typeof this.prismaService.annualRegistry;
  private annualClassroomService: typeof this.prismaService.annualClassroom;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;
  private annualClassroomDivisionService: typeof this.prismaService.annualClassroomDivision;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.annualMajorService = prismaService.annualMajor;
    this.academicYearService = prismaService.academicYear;
    this.annualTeacherService = prismaService.annualTeacher;
    this.annualStudentService = prismaService.annualStudent;
    this.annualRegistryService = prismaService.annualRegistry;
    this.annualClassroomService = prismaService.annualClassroom;
    this.annualConfiguratorService = prismaService.annualConfigurator;
    this.annualConfiguratorService = prismaService.annualConfigurator;
    this.annualClassroomDivisionService = prismaService.annualClassroomDivision;
  }

  async addNewAcademicYear(
    school_id: string,
    { starts_at, ends_at }: AcademicYearPostDto,
    added_by: string
  ) {
    if (starts_at > ends_at)
      throw new HttpException(JSON.stringify(ERR05), HttpStatus.BAD_REQUEST);
    const academicYear = await this.academicYearService.findFirst({
      where: {
        OR: {
          ends_at: {
            lt: new Date(starts_at),
          },
          starts_at: {
            gt: new Date(ends_at),
          },
        },
      },
    });
    if (academicYear)
      throw new HttpException(JSON.stringify(ERR05), HttpStatus.BAD_REQUEST);
    const { matricule, login_id } =
      await this.annualConfiguratorService.findUnique({
        select: { matricule: true, login_id: true },
        where: { annual_configurator_id: added_by },
      });
    const year_code = await this.codeGenerator.getYearCode(
      school_id,
      new Date(starts_at).getFullYear(),
      new Date(ends_at).getFullYear()
    );
    const [{ academic_year_id }] = await this.prismaService.$transaction([
      this.academicYearService.create({
        data: {
          ends_at,
          starts_at,
          year_code,
          AnnualConfigurator: {
            connect: { annual_configurator_id: added_by },
          },
          School: { connect: { school_id } },
        },
      }),
      this.annualConfiguratorService.create({
        data: {
          matricule,
          is_sudo: true,
          Login: { connect: { login_id } },
          AnnualConfigurator: {
            connect: { annual_configurator_id: added_by },
          },
          AcademicYear: {
            connect: { year_code },
          },
        },
      }),
    ]);
    return academic_year_id;
  }

  async templateAcademicYear(
    template_year_id: string,
    {
      ends_at,
      starts_at,
      classroomCodes,
      personnelConfig: {
        reuse_configurators,
        reuse_coordinators,
        reuse_registries,
        reuse_teachers,
      },
      reuse_coordinators_configs,
      reuse_registries_configs,
    }: TemplateYearPostDto,
    added_by: string
  ) {
    if (starts_at > ends_at)
      throw new HttpException(JSON.stringify(ERR05), HttpStatus.BAD_REQUEST);

    let academicYear = await this.academicYearService.findUnique({
      where: { academic_year_id: template_year_id },
    });
    if (!academicYear)
      throw new HttpException(
        JSON.stringify(AUTH404('Academic year')),
        HttpStatus.NOT_FOUND
      );

    const { school_id } = academicYear;
    //checking if there's any overlapping year
    academicYear = await this.academicYearService.findFirst({
      where: {
        OR: {
          ends_at: {
            lt: new Date(starts_at),
          },
          starts_at: {
            gt: new Date(ends_at),
          },
        },
      },
    });
    if (academicYear)
      throw new HttpException(JSON.stringify(ERR05), HttpStatus.BAD_REQUEST);

    const academicYearId = randomUUID();

    const newConfigurators: Prisma.AnnualConfiguratorCreateManyInput[] = [];
    if (reuse_configurators) {
      const configurators = await this.annualConfiguratorService.findMany({
        select: { matricule: true, login_id: true },
        where: { academic_year_id: template_year_id, is_deleted: false },
      });
      newConfigurators.push(
        ...configurators.map((configurator) => ({
          ...configurator,
          added_by,
          academic_year_id: academicYearId,
        }))
      );
    }

    const newRegistries: Prisma.AnnualRegistryCreateManyInput[] = [];
    if (reuse_registries) {
      const registries = await this.annualRegistryService.findMany({
        select: { matricule: true, login_id: true, private_code: true },
        where: { academic_year_id: template_year_id },
      });
      newRegistries.push(
        ...registries.map((registry) => ({
          ...registry,
          added_by,
          academic_year_id: academicYearId,
        }))
      );
    }

    const newTeachers: Prisma.AnnualTeacherCreateManyInput[] = [];
    if (reuse_teachers) {
      const teachers = await this.annualTeacherService.findMany({
        select: {
          hourly_rate: true,
          origin_institute: true,
          teaching_grade_id: true,
          teacher_id: true,
          has_signed_convention: true,
          login_id: true,
        },
        where: { academic_year_id: template_year_id, is_deleted: false },
      });
      newTeachers.push(
        ...teachers.map((teacher) => ({
          ...teacher,
          created_by: added_by,
          annual_teacher_id: randomUUID(),
          academic_year_id: academicYearId,
        }))
      );
    }

    const newMajors: Prisma.AnnualMajorCreateManyInput[] = [];
    const newClassrooms: Prisma.AnnualClassroomCreateManyInput[] = [];
    const newClassroomDivisions: Prisma.AnnualClassroomDivisionCreateManyInput[] =
      [];
    if (classroomCodes.length > 0) {
      const majors = await this.annualMajorService.findMany({
        select: {
          major_acronym: true,
          major_code: true,
          major_name: true,
          major_id: true,
          department_id: true,
        },
        where: {
          is_deleted: false,
          academic_year_id: template_year_id,
          OR: [
            ...classroomCodes.map((code) => ({
              Major: { Classrooms: { some: { classroom_code: code } } },
            })),
          ],
        },
      });
      newMajors.push(
        ...majors.map((data) => ({
          ...data,
          created_by: added_by,
          academic_year_id: academicYearId,
        }))
      );
      const classrooms = await this.annualClassroomService.findMany({
        select: {
          classroom_acronym: true,
          classroom_code: true,
          classroom_id: true,
          classroom_name: true,
          registration_fee: true,
          total_fee_due: true,
          AnnualClassroomDivisions: {
            select: {
              annual_classroom_id: true,
              division_letter: true,
              AnnualTeacher: {
                select: {
                  Teacher: {
                    select: {
                      teacher_id: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          academic_year_id: template_year_id,
          is_deleted: false,
          OR: [...classroomCodes.map((code) => ({ classroom_code: code }))],
        },
      });
      newClassrooms.push(
        ...classrooms.map(({ AnnualClassroomDivisions, ...classroom }) => {
          newClassroomDivisions.push(
            ...AnnualClassroomDivisions.map(
              ({
                AnnualTeacher: {
                  Teacher: { teacher_id },
                },
                ...data
              }) => ({
                ...data,
                created_by: added_by,
                annual_coordinator_id: reuse_coordinators
                  ? newTeachers.find(({ teacher_id: id }) => id === teacher_id)
                      .annual_teacher_id
                  : null,
              })
            )
          );
          return {
            ...classroom,
            academic_year_id: academicYearId,
          };
        })
      );
    }

    if (reuse_coordinators_configs) {
      //TODO complete this methode after working on coordinator settings
    }
    if (reuse_registries_configs) {
      //TODO complete this methode after working on registry settings
    }

    const { matricule, login_id } =
      await this.annualConfiguratorService.findUnique({
        select: { matricule: true, login_id: true },
        where: { annual_configurator_id: added_by },
      });
    const year_code = await this.codeGenerator.getYearCode(
      school_id,
      new Date(starts_at).getFullYear(),
      new Date(ends_at).getFullYear()
    );
    await this.prismaService.$transaction([
      this.academicYearService.create({
        data: {
          ends_at,
          starts_at,
          year_code,
          academic_year_id: academicYearId,
          AnnualConfigurator: {
            connect: { annual_configurator_id: added_by },
          },
          School: { connect: { school_id } },
        },
      }),
      this.annualConfiguratorService.create({
        data: {
          matricule,
          is_sudo: true,
          Login: { connect: { login_id } },
          AnnualConfigurator: {
            connect: { annual_configurator_id: added_by },
          },
          AcademicYear: {
            connect: { year_code },
          },
        },
      }),
      this.annualConfiguratorService.createMany({
        data: newConfigurators,
        skipDuplicates: true,
      }),
      this.annualRegistryService.createMany({
        data: newRegistries,
        skipDuplicates: true,
      }),
      this.annualTeacherService.createMany({
        data: newTeachers,
      }),
      this.annualMajorService.createMany({
        data: newMajors,
        skipDuplicates: true,
      }),
      this.annualClassroomService.createMany({
        data: newClassrooms,
        skipDuplicates: true,
      }),
      this.annualClassroomDivisionService.createMany({
        data: newClassroomDivisions,
        skipDuplicates: true,
      }),
      //TODO create academic year template information
    ]);
    return academicYearId;
  }

  async getAcademicYears(login_id: string) {
    const select = {
      AcademicYear: {
        select: {
          year_code: true,
          started_at: true,
          ended_at: true,
          year_status: true,
          starts_at: true,
          ends_at: true,
          academic_year_id: true,
        },
      },
    };
    //check for annual student
    const annualStudents = (await this.annualStudentService.findMany({
      select,
      where: { Student: { login_id }, is_deleted: false },
    })) as AcademicYearObject[];
    if (annualStudents.length > 0) {
      return annualStudents.map(
        ({
          AcademicYear: {
            academic_year_id,
            year_code,
            ended_at,
            ends_at,
            started_at,
            starts_at,
            year_status,
          },
        }) => ({
          year_code,
          year_status,
          academic_year_id,
          starting_date:
            year_status !== AcademicYearStatus.INACTIVE
              ? started_at
              : starts_at,
          ending_date:
            year_status !== AcademicYearStatus.FINISHED ? ends_at : ended_at,
        })
      );
    }

    //check for annual configurator
    const annualConfigurators = (await this.annualConfiguratorService.findMany({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualRegistries = (await this.annualRegistryService.findMany({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualTeachers = (await this.annualTeacherService.findMany({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    const academic_years: ActiveYear[] = [];

    [...annualConfigurators, ...annualRegistries, ...annualTeachers].forEach(
      ({
        AcademicYear: {
          academic_year_id,
          year_code,
          ended_at,
          ends_at,
          started_at,
          starts_at,
          year_status,
        },
      }) => {
        if (
          !academic_years.find((_) => _.academic_year_id === academic_year_id)
        ) {
          academic_years.push({
            year_code,
            year_status,
            academic_year_id,
            starting_date:
              year_status !== AcademicYearStatus.INACTIVE
                ? started_at
                : starts_at,
            ending_date:
              year_status !== AcademicYearStatus.FINISHED ? ends_at : ended_at,
          });
        }
      }
    );

    return academic_years;
  }
}
