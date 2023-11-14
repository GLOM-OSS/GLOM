import { GlomPrismaService } from '@glom/prisma';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  AcademicYearStatus,
  CarryOverSystemEnum,
  EvaluationSubTypeEnum,
  EvaluationTypeEnum,
} from '@prisma/client';
import { AnnualSessionData, UserRole } from '../../app/auth/auth';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { Role } from '../../utils/enums';
import {
  AcademicYearEntity,
  CreateAcademicYearDto,
} from './academic-years.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async create(
    school_id: string,
    { starts_at, ends_at }: CreateAcademicYearDto,
    created_by: string
  ) {
    if (starts_at > ends_at)
      throw new BadRequestException('Invalid date range');
    const existingYear = await this.prismaService.academicYear.findFirst({
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
    if (existingYear) throw new ConflictException('Conflicting academic years');
    const { matricule, login_id } =
      await this.prismaService.annualConfigurator.findUnique({
        select: { matricule: true, login_id: true },
        where: { annual_configurator_id: created_by },
      });
    const year_code = await this.codeGenerator.getYearCode(
      starts_at.getFullYear(),
      ends_at.getFullYear(),
      school_id
    );
    const {
      AnnualCarryOverSytems,
      AnnualSemesterExamAcess,
      AnnualEvaluationSubTypes,
    } = await this.getDefaultSettings(created_by);
    const [academicYear] = await this.prismaService.$transaction([
      this.prismaService.academicYear.create({
        data: {
          ends_at,
          starts_at,
          year_code,
          CreatedBy: {
            connect: { annual_configurator_id: created_by },
          },
          School: { connect: { school_id } },
          AnnualCarryOverSytems,
          AnnualSemesterExamAcess,
          AnnualEvaluationSubTypes,
        },
      }),
      this.prismaService.annualConfigurator.create({
        data: {
          matricule,
          is_sudo: true,
          Login: { connect: { login_id } },
          CreatedBy: {
            connect: { annual_configurator_id: created_by },
          },
          AcademicYear: {
            connect: { year_code },
          },
        },
      }),
    ]);
    return new AcademicYearEntity(academicYear);
  }

  // async template(
  //   template_year_id: string,
  //   {
  //     ends_at,
  //     starts_at,
  //     classroomCodes,
  //     personnelConfig: {
  //       reuse_configurators,
  //       reuse_coordinators,
  //       reuse_registries,
  //       reuse_teachers,
  //     },
  //     reuse_coordinators_configs,
  //     reuse_registries_configs,
  //   }: TemplateAcademicYearDto,
  //   added_by: string
  // ) {
  //   if (starts_at > ends_at)
  //     throw new BadRequestException('Invalid date range');

  //   let academicYear = await this.prismaService.academicYear.findUnique({
  //     where: { academic_year_id: template_year_id },
  //   });
  //   if (!academicYear) throw new NotFoundException('Academic year not found');

  //   const { school_id } = academicYear;
  //   //checking if there's any overlapping year
  //   academicYear = await this.prismaService.academicYear.findFirst({
  //     where: {
  //       OR: {
  //         ends_at: {
  //           lt: new Date(starts_at),
  //         },
  //         starts_at: {
  //           gt: new Date(ends_at),
  //         },
  //       },
  //     },
  //   });
  //   if (academicYear) throw new ConflictException('Conflicting academic years');

  //   const academicYearId = randomUUID();
  //   const newConfigurators: Prisma.AnnualConfiguratorCreateManyInput[] = [];

  //   if (reuse_configurators) {
  //     const configurators =
  //       await this.prismaService.annualConfigurator.findMany({
  //         select: { matricule: true, login_id: true },
  //         where: { academic_year_id: template_year_id, is_deleted: false },
  //       });
  //     newConfigurators.push(
  //       ...configurators.map((configurator) => ({
  //         ...configurator,
  //         added_by,
  //         academic_year_id: academicYearId,
  //       }))
  //     );
  //   }

  //   const newRegistries: Prisma.AnnualRegistryCreateManyInput[] = [];
  //   if (reuse_registries) {
  //     const registries = await this.prismaService.annualRegistry.findMany({
  //       select: { matricule: true, login_id: true, private_code: true },
  //       where: { academic_year_id: template_year_id },
  //     });
  //     newRegistries.push(
  //       ...registries.map((registry) => ({
  //         ...registry,
  //         added_by,
  //         academic_year_id: academicYearId,
  //       }))
  //     );
  //   }

  //   const newTeachers: Prisma.AnnualTeacherCreateManyInput[] = [];
  //   if (reuse_teachers) {
  //     const teachers = await this.prismaService.annualTeacher.findMany({
  //       select: {
  //         hourly_rate: true,
  //         origin_institute: true,
  //         teaching_grade_id: true,
  //         teacher_id: true,
  //         has_signed_convention: true,
  //         login_id: true,
  //       },
  //       where: { academic_year_id: template_year_id, is_deleted: false },
  //     });
  //     newTeachers.push(
  //       ...teachers.map((teacher) => ({
  //         ...teacher,
  //         created_by: added_by,
  //         annual_teacher_id: randomUUID(),
  //         academic_year_id: academicYearId,
  //       }))
  //     );
  //   }

  //   const newMajors: Prisma.AnnualMajorCreateManyInput[] = [];
  //   const newClassrooms: Prisma.AnnualClassroomCreateManyInput[] = [];
  //   const newClassroomDivisions: Prisma.AnnualClassroomDivisionCreateManyInput[] =
  //     [];
  //   if (classroomCodes.length > 0) {
  //     const majors = await this.prismaService.annualMajor.findMany({
  //       select: {
  //         major_acronym: true,
  //         major_code: true,
  //         major_name: true,
  //         major_id: true,
  //         department_id: true,
  //       },
  //       where: {
  //         is_deleted: false,
  //         academic_year_id: template_year_id,
  //         OR: [
  //           ...classroomCodes.map((code) => ({
  //             Major: { Classrooms: { some: { classroom_code: code } } },
  //           })),
  //         ],
  //       },
  //     });
  //     newMajors.push(
  //       ...majors.map((data) => ({
  //         ...data,
  //         created_by: added_by,
  //         academic_year_id: academicYearId,
  //       }))
  //     );
  //     const classrooms = await this.prismaService.annualClassroom.findMany({
  //       select: {
  //         classroom_acronym: true,
  //         classroom_code: true,
  //         classroom_id: true,
  //         classroom_name: true,
  //         registration_fee: true,
  //         total_fee_due: true,
  //         AnnualClassroomDivisions: {
  //           select: {
  //             annual_classroom_id: true,
  //             division_letter: true,
  //             AnnualTeacher: {
  //               select: {
  //                 Teacher: {
  //                   select: {
  //                     teacher_id: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       where: {
  //         academic_year_id: template_year_id,
  //         is_deleted: false,
  //         OR: [...classroomCodes.map((code) => ({ classroom_code: code }))],
  //       },
  //     });
  //     newClassrooms.push(
  //       ...classrooms.map(({ AnnualClassroomDivisions, ...classroom }) => {
  //         newClassroomDivisions.push(
  //           ...AnnualClassroomDivisions.map(
  //             ({
  //               AnnualTeacher: {
  //                 Teacher: { teacher_id },
  //               },
  //               ...data
  //             }) => ({
  //               ...data,
  //               created_by: added_by,
  //               annual_coordinator_id: reuse_coordinators
  //                 ? newTeachers.find(({ teacher_id: id }) => id === teacher_id)
  //                     .annual_teacher_id
  //                 : null,
  //             })
  //           )
  //         );
  //         return {
  //           ...classroom,
  //           academic_year_id: academicYearId,
  //         };
  //       })
  //     );
  //   }

  //   if (reuse_coordinators_configs) {
  //     //TODO complete this methode after working on coordinator settings
  //   }
  //   if (reuse_registries_configs) {
  //     //TODO complete this methode after working on registry settings
  //   }

  //   const { matricule, login_id } =
  //     await this.prismaService.annualConfigurator.findUnique({
  //       select: { matricule: true, login_id: true },
  //       where: { annual_configurator_id: added_by },
  //     });
  //   const year_code = await this.codeGenerator.getYearCode(
  //     new Date(starts_at).getFullYear(),
  //     new Date(ends_at).getFullYear(),
  //     school_id
  //   );
  //   const {
  //     AnnualCarryOverSytems,
  //     AnnualSemesterExamAcess,
  //     AnnualEvaluationSubTypes,
  //   } = await this.buildAcademicYearDefaultCreateInput(added_by);
  //   await this.prismaService.$transaction([
  //     this.prismaService.academicYear.create({
  //       data: {
  //         ends_at,
  //         starts_at,
  //         year_code,
  //         academic_year_id: academicYearId,
  //         AnnualConfigurator: {
  //           connect: { annual_configurator_id: added_by },
  //         },
  //         School: { connect: { school_id } },
  //         AnnualCarryOverSytems,
  //         AnnualSemesterExamAcess,
  //         AnnualEvaluationSubTypes,
  //       },
  //     }),
  //     this.prismaService.annualConfigurator.create({
  //       data: {
  //         matricule,
  //         is_sudo: true,
  //         Login: { connect: { login_id } },
  //         CreatedByAnnualConfigurator: {
  //           connect: { annual_configurator_id: added_by },
  //         },
  //         AcademicYear: {
  //           connect: { year_code },
  //         },
  //       },
  //     }),
  //     this.prismaService.annualConfigurator.createMany({
  //       data: newConfigurators,
  //       skipDuplicates: true,
  //     }),
  //     this.prismaService.annualRegistry.createMany({
  //       data: newRegistries,
  //       skipDuplicates: true,
  //     }),
  //     this.prismaService.annualTeacher.createMany({
  //       data: newTeachers,
  //     }),
  //     this.prismaService.annualMajor.createMany({
  //       data: newMajors,
  //       skipDuplicates: true,
  //     }),
  //     this.prismaService.annualClassroom.createMany({
  //       data: newClassrooms,
  //       skipDuplicates: true,
  //     }),
  //     this.prismaService.annualClassroomDivision.createMany({
  //       data: newClassroomDivisions,
  //       skipDuplicates: true,
  //     }),
  //     //TODO create academic year template information
  //   ]);
  //   return academicYearId;
  // }

  async findAll(login_id: string) {
    //check for annual student
    const annualStudents = await this.prismaService.annualStudent.findMany({
      select: { AcademicYear: true },
      where: { Student: { login_id }, is_deleted: false },
    });
    if (annualStudents.length > 0) {
      return annualStudents.map(
        ({ AcademicYear: academicYear }) => new AcademicYearEntity(academicYear)
      );
    }

    //check for annual configurators
    const annualConfigurators =
      await this.prismaService.annualConfigurator.findMany({
        select: { AcademicYear: true },
        where: { login_id, is_deleted: false },
      });

    //check for annual registry
    const annualRegistries = await this.prismaService.annualRegistry.findMany({
      select: { AcademicYear: true },
      where: { login_id, is_deleted: false },
    });

    //check for annual teachers
    const annualTeachers = await this.prismaService.annualTeacher.findMany({
      select: { AcademicYear: true },
      where: { Teacher: { login_id }, is_deleted: false },
    });

    return [
      ...annualTeachers,
      ...annualRegistries,
      ...annualConfigurators,
    ].reduce<AcademicYearEntity[]>(
      (academicYears, { AcademicYear: academicYear }) =>
        academicYears.find(
          (_) => _.academic_year_id === academicYear.academic_year_id
        )
          ? academicYears
          : [...academicYears, new AcademicYearEntity(academicYear)],
      []
    );
  }

  async selectAcademicYear(
    login_id: string,
    academic_year_id: string
  ): Promise<AnnualSessionData> {
    const retrivedRoles: UserRole[] = [];
    const { started_at, ended_at, starts_at, ends_at, year_code, year_status } =
      await this.prismaService.academicYear.findFirst({
        where: {
          academic_year_id,
          is_deleted: false,
        },
      });

    let annualSessionData: AnnualSessionData = {
      activeYear: {
        year_code,
        year_status,
        academic_year_id,
        starting_date:
          year_status !== AcademicYearStatus.INACTIVE ? started_at : starts_at,
        ending_date:
          year_status !== AcademicYearStatus.FINISHED ? ends_at : ended_at,
      },
    };

    //check for annual student
    const annualStudent = await this.prismaService.annualStudent.findFirst({
      select: {
        student_id: true,
        annual_student_id: true,
        Student: {
          select: {
            Classroom: { select: { classroom_code: true, level: true } },
          },
        },
        AnnualStudentHasCreditUnits: {
          distinct: ['semester_number'],
          select: { semester_number: true },
        },
      },
      where: {
        academic_year_id,
        is_deleted: false,
        Student: { login_id },
      },
    });
    if (annualStudent) {
      const {
        student_id,
        annual_student_id,
        Student: {
          Classroom: { classroom_code, level: classroom_level },
        },
        AnnualStudentHasCreditUnits: crediUnits,
      } = annualStudent;
      annualSessionData = {
        ...annualSessionData,
        annualStudent: {
          student_id,
          classroom_code,
          classroom_level,
          annual_student_id,
          activeSemesters: crediUnits.map((_) => _.semester_number),
        },
      };
      retrivedRoles.push({
        user_id: annualStudent.annual_student_id,
        role: Role.STUDENT,
      });
    } else {
      //check for annual configurator
      const annualConfigurator =
        await this.prismaService.annualConfigurator.findFirst({
          where: {
            login_id,
            academic_year_id,
            is_deleted: false,
          },
        });
      if (annualConfigurator) {
        const { annual_configurator_id, is_sudo } = annualConfigurator;
        annualSessionData = {
          ...annualSessionData,
          annualConfigurator: { annual_configurator_id, is_sudo },
        };
        retrivedRoles.push({
          user_id: annualConfigurator.annual_configurator_id,
          role: Role.CONFIGURATOR,
        });
      }

      //check for annual registry
      const annualRegistry = await this.prismaService.annualRegistry.findFirst({
        where: {
          login_id,
          academic_year_id,
          is_deleted: false,
        },
      });
      if (annualRegistry) {
        const { annual_registry_id } = annualRegistry;
        annualSessionData = {
          ...annualSessionData,
          annualRegistry: { annual_registry_id },
        };
        retrivedRoles.push({
          user_id: annualRegistry.annual_registry_id,
          role: Role.REGISTRY,
        });
      }

      //check for annual teacher
      const annualTeacher = await this.prismaService.annualTeacher.findFirst({
        where: {
          academic_year_id,
          is_deleted: false,
          Teacher: { login_id },
        },
      });
      if (annualTeacher) {
        const {
          annual_teacher_id,
          has_signed_convention,
          hourly_rate,
          origin_institute,
        } = annualTeacher;
        retrivedRoles.push({
          user_id: annual_teacher_id,
          role: Role.TEACHER,
        });
        const classroomDivisions =
          await this.prismaService.annualClassroomDivision.findMany({
            where: { annual_coordinator_id: annual_teacher_id },
          });
        if (classroomDivisions.length > 0)
          retrivedRoles.push({
            user_id: annual_teacher_id,
            role: Role.COORDINATOR,
          });
        annualSessionData = {
          ...annualSessionData,
          annualTeacher: {
            classroomDivisions: classroomDivisions.map(
              ({ annual_classroom_division_id: id }) => id
            ),
            annual_teacher_id,
            has_signed_convention,
            hourly_rate,
            origin_institute,
          },
        };
      }
    }
    return annualSessionData;
  }

  private async getDefaultSettings(annual_configurator_id: string) {
    const evaluationTypes = await this.prismaService.evaluationType.findMany();

    return {
      AnnualCarryOverSytems: {
        create: {
          carry_over_system: CarryOverSystemEnum.SUBJECT,
          CreatedBy: {
            connect: { annual_configurator_id },
          },
        },
      },
      AnnualSemesterExamAcess: {
        createMany: {
          data: [
            {
              annual_semester_number: 1,
              configured_by: annual_configurator_id,
              payment_percentage: 0,
            },
            {
              annual_semester_number: 2,
              configured_by: annual_configurator_id,
              payment_percentage: 0,
            },
          ],
        },
      },
      AnnualEvaluationSubTypes: {
        createMany: {
          data: [
            {
              evaluation_sub_type_name: EvaluationSubTypeEnum.CA,
              evaluation_type_id: evaluationTypes.find(
                (_) => _.evaluation_type === EvaluationTypeEnum.CA
              ).evaluation_type_id,
              evaluation_sub_type_weight: 100,
            },
            {
              evaluation_sub_type_name: EvaluationSubTypeEnum.EXAM,
              evaluation_type_id: evaluationTypes.find(
                (_) => _.evaluation_type === EvaluationTypeEnum.EXAM
              ).evaluation_type_id,
              evaluation_sub_type_weight: 100,
            },
            {
              evaluation_sub_type_name: EvaluationSubTypeEnum.RESIT,
              evaluation_type_id: evaluationTypes.find(
                (_) => _.evaluation_type === EvaluationTypeEnum.EXAM
              ).evaluation_type_id,
              evaluation_sub_type_weight: 100,
            },
          ],
        },
      },
    };
  }
}
