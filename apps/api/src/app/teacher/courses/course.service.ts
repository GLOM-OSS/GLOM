import { Injectable } from '@nestjs/common';
import { EvaluationSubTypeEnum, Prisma } from '@prisma/client';
import { Assessment, Course, PresenceList, Student } from '@squoolr/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CourseService {
  private annualClassroomSelect =
    Prisma.validator<Prisma.AnnualClassroomArgs>()({
      select: {
        classroom_acronym: true,
        Classroom: {
          select: {
            level: true,
            Major: {
              select: {
                major_id: true,
                AnnualCreditUnits: {
                  select: {
                    AnnualCreditUnitSubjects: {
                      select: { subject_code: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  private annualCreditUnitSubjectSelect =
    Prisma.validator<Prisma.AnnualCreditUnitSubjectArgs>()({
      select: {
        annual_credit_unit_subject_id: true,
        subject_title: true,
        subject_code: true,
        objective: true,
        Chapters: {
          select: { chapter_id: true },
        },
        Evaluations: {
          select: {
            published_at: true,
            examination_date: true,
            EvaluationHasStudents: {
              select: { evaluation_has_student_id: true },
            },
            AnnualEvaluationSubType: {
              select: { evaluation_sub_type_name: true },
            },
          },
        },
        AnnualCreditUnit: {
          select: {
            major_id: true,
            semester_number: true,
            _count: {
              select: {
                AnnualStudentHasCreditUnits: true,
              },
            },
          },
        },
      },
    });
  constructor(private prismaService: PrismaService) {}

  async findAll(
    academic_year_id: string,
    whereInput: Prisma.AnnualCreditUnitSubjectWhereInput
  ) {
    const subects = await this.prismaService.annualCreditUnitSubject.findMany({
      select: this.annualCreditUnitSubjectSelect.select,
      where: whereInput,
    });

    const classrooms = await this.prismaService.annualClassroom.findMany({
      select: this.annualClassroomSelect.select,
      where: {
        OR: subects.map(
          ({ AnnualCreditUnit: { major_id, semester_number } }) => ({
            academic_year_id,
            Classroom: {
              major_id,
              level: Math.ceil(semester_number / 2),
            },
          })
        ),
      },
    });

    const activeYear = await this.prismaService.academicYear.findUnique({
      where: { academic_year_id },
    });
    const courses = subects.map((subject) =>
      this.getCourseObject(subject, classrooms, activeYear.ended_at)
    );
    return courses;
  }

  async findOne(
    academic_year_id: string,
    annual_credit_unit_subject_id: string
  ) {
    const classrooms = await this.prismaService.annualClassroom.findMany({
      select: {
        academic_year_id: true,
        ...this.annualClassroomSelect.select,
      },
      where: {
        Classroom: {
          Major: {
            AnnualCreditUnits: {
              some: {
                AnnualCreditUnitSubjects: {
                  some: { annual_credit_unit_subject_id },
                },
              },
            },
          },
        },
      },
    });
    const annualCreditUnitSubject =
      await this.prismaService.annualCreditUnitSubject.findUniqueOrThrow({
        select: this.annualCreditUnitSubjectSelect.select,
        where: { annual_credit_unit_subject_id },
      });
    const activeYear = await this.prismaService.academicYear.findUnique({
      where: { academic_year_id },
    });
    return this.getCourseObject(
      annualCreditUnitSubject,
      classrooms,
      activeYear.ended_at
    );
  }

  private getCourseObject(
    subject: Prisma.AnnualCreditUnitSubjectGetPayload<
      typeof this.annualCreditUnitSubjectSelect
    >,
    classrooms: Prisma.AnnualClassroomGetPayload<
      typeof this.annualClassroomSelect
    >[],
    activeYearEndDate: Date | null
  ): Course {
    const {
      Chapters,
      objective,
      Evaluations,
      subject_code,
      subject_title,
      annual_credit_unit_subject_id,
      AnnualCreditUnit: {
        semester_number,
        _count: { AnnualStudentHasCreditUnits: number_of_students },
      },
    } = subject;
    const classroomAcronyms = classrooms
      .filter(
        ({
          Classroom: {
            Major: { AnnualCreditUnits },
          },
        }) =>
          AnnualCreditUnits.find(({ AnnualCreditUnitSubjects }) =>
            AnnualCreditUnitSubjects.find(
              (_) => _.subject_code === subject_code
            )
          )
      )
      .map(({ classroom_acronym }) => classroom_acronym);
    const resitEvaluation = Evaluations.find(
      ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
        evaluation_sub_type_name === EvaluationSubTypeEnum.RESIT
    );
    return {
      objective,
      subject_code,
      subject_title,
      classroomAcronyms,
      number_of_students,
      semester: semester_number,
      annual_credit_unit_subject_id,
      has_course_plan: Chapters.length > 0,
      is_ca_available: Boolean(
        Evaluations.find(
          ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
            evaluation_sub_type_name === EvaluationSubTypeEnum.CA
        )?.published_at
      ),
      is_exam_available: Boolean(
        Evaluations.find(
          ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
            evaluation_sub_type_name === EvaluationSubTypeEnum.EXAM
        )?.published_at
      ),
      is_resit_available: Boolean(
        activeYearEndDate ??
          (resitEvaluation && resitEvaluation.examination_date)
          ? (new Date(resitEvaluation.examination_date) < new Date() &&
              resitEvaluation.EvaluationHasStudents.length === 0) ??
              resitEvaluation.published_at
          : false
      ),
    };
  }

  async findResources(annual_credit_unit_subject_id: string) {
    const resources = await this.prismaService.resource.findMany({
      select: {
        annual_credit_unit_subject_id: true,
        resource_extension: true,
        resource_name: true,
        resource_ref: true,
        resource_type: true,
        resource_id: true,
        chapter_id: true,
      },
      where: {
        annual_credit_unit_subject_id,
        is_deleted: false,
      },
    });
    return resources.filter((_) => _.chapter_id === null);
  }

  async findChapters(
    annual_credit_unit_subject_id: string,
    isNotDone?: boolean
  ) {
    const chapters = await this.prismaService.chapter.findMany({
      select: {
        chapter_id: true,
        chapter_title: true,
        chapter_objective: true,
        annual_credit_unit_subject_id: true,
        chapter_position: true,
        chapter_parent_id: true,
      },
      where: {
        annual_credit_unit_subject_id,
        is_deleted: false,
        ...(isNotDone ? { PresenceListHasChapters: { none: {} } } : {}),
      },
    });
    return chapters.filter((_) => _.chapter_parent_id === null);
  }

  async findAssessments(
    annual_credit_unit_subject_id: string,
    is_assignment: boolean,
    is_student: boolean
  ): Promise<Assessment[]> {
    const assessments = await this.prismaService.assessment.findMany({
      include: {
        Evaluation: {
          select: {
            AnnualEvaluationSubType: {
              select: { evaluation_sub_type_name: true },
            },
          },
        },
        Questions: { select: { question_mark: true } },
      },
      where: {
        annual_credit_unit_subject_id,
        is_deleted: false,
        is_assignment,
      },
    });
    return assessments
      .filter((_) => {
        return (
          _.chapter_id === null &&
          ((is_student && _.assessment_date) || !is_student)
        );
      })
      .map(
        ({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          is_deleted,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          created_by,
          Evaluation,
          Questions,
          ...data
        }) => ({
          evaluation_sub_type_name:
            Evaluation?.AnnualEvaluationSubType?.evaluation_sub_type_name ??
            null,
          ...data,
          total_mark: Questions.reduce(
            (total, _) => total + _.question_mark,
            0
          ),
        })
      );
  }

  async findPresentLists(
    annual_credit_unit_subject_id: string
  ): Promise<PresenceList[]> {
    const presenceLists = await this.prismaService.presenceList.findMany({
      select: {
        end_time: true,
        start_time: true,
        is_published: true,
        presence_list_id: true,
        presence_list_date: true,
        AnnualCreditUnitSubject: {
          select: { subject_code: true, subject_title: true },
        },
        PresenceListHasChapters: {
          select: {
            Chapter: { select: { chapter_id: true, chapter_title: true } },
          },
          where: { Chapter: { is_deleted: false } },
        },
      },
      where: { annual_credit_unit_subject_id, is_deleted: false },
    });
    const chapters = await this.prismaService.chapter.findMany({
      select: { chapter_id: true },
      where: { is_deleted: false, annual_credit_unit_subject_id },
    });
    return presenceLists.map(
      ({
        AnnualCreditUnitSubject: subject,
        PresenceListHasChapters,
        ...presenceList
      }) => ({
        ...subject,
        ...presenceList,
        chapters: PresenceListHasChapters.map(({ Chapter: chapter }) => ({
          ...chapter,
          is_covered: Boolean(
            chapters.find((_) => _.chapter_id === chapter.chapter_id)
          ),
        })),
        students: [],
      })
    );
  }

  async findStudents(
    annual_credit_unit_subject_id: string
  ): Promise<Student[]> {
    const students = await this.prismaService.annualStudent.findMany({
      select: {
        is_active: true,
        annual_student_id: true,
        Student: {
          select: {
            matricule: true,
            Classroom: { select: { classroom_acronym: true } },
            Login: {
              select: {
                Person: true,
              },
            },
          },
        },
      },
      where: {
        AnnualStudentHasCreditUnits: {
          some: {
            AnnualCreditUnit: {
              AnnualCreditUnitSubjects: {
                some: { annual_credit_unit_subject_id },
              },
            },
          },
        },
      },
    });
    return students.map(
      ({
        is_active,
        annual_student_id,
        Student: {
          matricule,
          Login: { Person: person },
          Classroom: { classroom_acronym },
        },
      }) => ({
        ...person,
        matricule,
        is_active,
        annual_student_id,
        classroom_acronym,
      })
    );
  }
}
