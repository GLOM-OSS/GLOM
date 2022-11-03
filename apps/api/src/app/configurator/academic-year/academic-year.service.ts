import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcademicYear, AcademicYearStatus, Prisma } from '@prisma/client';
import { AUTH404, ERR05 } from 'apps/api/src/errors';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { CodeGeneratorService } from 'apps/api/src/utils/code-generator';
import { ActiveYear } from 'apps/api/src/utils/types';
import { AcademicYearPostDto, TemplateYearPostDto } from '../configurator.dto';

type AcademicYearObject = { AcademicYear: AcademicYear };

@Injectable()
export class AcademicYearService {
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
            lt: starts_at,
          },
          starts_at: {
            gt: ends_at,
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
      starts_at.getFullYear(),
      ends_at.getFullYear()
    );
    await this.prismaService.$transaction([
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
    if (academicYear)
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
            lt: starts_at,
          },
          starts_at: {
            gt: ends_at,
          },
        },
      },
    });
    if (academicYear)
      throw new HttpException(JSON.stringify(ERR05), HttpStatus.BAD_REQUEST);

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
          academic_year_id: null,
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
          academic_year_id: null,
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
          academic_year_id: null,
        }))
      );
    }

    const newClassrooms: Prisma.AnnualClassroomCreateManyInput[] = [];
    const newClassroomDivisions: Prisma.AnnualClassroomDivisionCreateManyInput[] =
      [];
    if (classroomCodes.length > 0) {
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
              annual_coordinator_id: true,
              annual_classroom_id: true,
              division_letter: true,
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
              ({ annual_coordinator_id: id, ...data }) => ({
                ...data,
                created_by: added_by,
                annual_coordinator_id: reuse_coordinators ? id : null,
              })
            )
          );
          return {
            ...classroom,
            academic_year_id: null,
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
      starts_at.getFullYear(),
      ends_at.getFullYear()
    );
    await this.prismaService.$transaction([
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
      this.annualClassroomService.createMany({
        data: newClassrooms,
        skipDuplicates: true,
      }),
      this.annualClassroomDivisionService.createMany({
        data: newClassroomDivisions,
        skipDuplicates: true,
      }),
    ]);
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
