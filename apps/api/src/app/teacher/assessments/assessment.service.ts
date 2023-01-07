import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Assessment,
  EvaluationHasStudent,
  PrismaPromise,
} from '@prisma/client';
import { AUTH404, ERR18 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AssessmentPutDto,
  PublishAssessmentDto,
  QuestionPostDto,
  QuestionPutDto,
} from '../teacher.dto';

@Injectable()
export class AssessmentService {
  constructor(private prismaService: PrismaService) {}

  async createAssessment(
    annual_credit_unit_subject_id: string,
    created_by: string
  ) {
    return this.prismaService.assessment.create({
      data: {
        AnnualCreditUnitSubject: { connect: { annual_credit_unit_subject_id } },
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
      },
    });
  }

  async getAssessment(assessment_id: string) {
    const assessment = await this.prismaService.assessment.findUnique({
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
      where: { assessment_id },
    });
    if (assessment) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        is_deleted,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        created_by,
        Evaluation,
        Questions,
        ...data
      } = assessment;
      return {
        ...data,
        evaluation_sub_type_name:
          Evaluation?.AnnualEvaluationSubType?.evaluation_sub_type_name ?? null,
        total_mark: Questions.reduce((total, _) => total + _.question_mark, 0),
      };
    }
    return null;
  }

  async updateAssessment(
    assessment_id: string,
    newAssessment: AssessmentPutDto,
    audited_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: {
        duration: true,
        is_deleted: true,
        is_published: true,
        assessment_date: true,
      },
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    await this.prismaService.assessment.update({
      data: {
        ...newAssessment,
        AssessmentAudits: { create: { ...assessment, audited_by: audited_by } },
      },
      where: { assessment_id },
    });
  }

  async publishAssessment(
    { assessment_id, evaluation_id }: PublishAssessmentDto,
    audited_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: {
        duration: true,
        is_deleted: true,
        is_published: true,
        assessment_date: true,
      },
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    if (new Date() > new Date(assessment.assessment_date))
      throw new HttpException(
        JSON.stringify(ERR18),
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const publishMarksInstructions: PrismaPromise<
      EvaluationHasStudent | Assessment
    >[] = [];
    if (evaluation_id) {
      const evaluationHasStudentAudits =
        await this.prismaService.evaluationHasStudent.findMany({
          select: {
            evaluation_id: true,
            annual_student_id: true,
            is_deleted: true,
            anonymity_code: true,
            edition_granted_at: true,
            is_editable: true,
            mark: true,
            evaluation_has_student_id: true,
            ref_evaluation_has_student_id: true,
          },
          where: { evaluation_id },
        });
      const studentAssessmentMarks =
        await this.prismaService.annualStudentTakeAssessment.findMany({
          select: { annual_student_id: true, total_score: true },
          where: { assessment_id },
        });

      publishMarksInstructions.push(
        ...evaluationHasStudentAudits.map((_) => {
          const { total_score, annual_student_id } =
            studentAssessmentMarks.find(
              (__) => __.annual_student_id === _.annual_student_id
            );
          const { evaluation_has_student_id, ...auditData } =
            evaluationHasStudentAudits.find(
              (_) => _.annual_student_id === annual_student_id
            );
          return this.prismaService.evaluationHasStudent.update({
            data: {
              mark: total_score,
              EvaluationHasStudentAudits: {
                create: {
                  audited_by,
                  ...auditData,
                },
              },
            },
            where: { evaluation_has_student_id },
          });
        })
      );
    }
    return this.prismaService.$transaction([
      this.prismaService.assessment.update({
        where: { assessment_id },
        data: {
          is_published: true,
          AssessmentAudits: {
            create: {
              ...assessment,
              AnnualTeacher: { connect: { annual_teacher_id: audited_by } },
            },
          },
        },
      }),
      ...publishMarksInstructions,
    ]);
  }

  async getAssessmentQuestions(assessment_id: string) {
    const questions = await this.prismaService.question.findMany({
      select: {
        question_id: true,
        question: true,
        question_mark: true,
        QuestionOptions: {
          select: { question_option_id: true, option: true, is_answer: true },
        },
        QuestionResources: {
          select: {
            question_resource_id: true,
            caption: true,
            resource_ref: true,
          },
        },
      },
      where: {
        assessment_id,
        is_deleted: false,
        QuestionOptions: { some: { is_deleted: false } },
      },
    });
    return questions.map(
      ({
        QuestionOptions: questionOptions,
        QuestionResources: questionRessources,
        ...question
      }) => ({
        ...question,
        questionOptions,
        questionRessources,
      })
    );
  }

  async getQuestion(question_id: string) {
    const question = await this.prismaService.question.findUnique({
      select: {
        question_id: true,
        question: true,
        question_mark: true,
        QuestionOptions: {
          select: { question_option_id: true, option: true, is_answer: true },
        },
        QuestionResources: {
          select: {
            question_resource_id: true,
            caption: true,
            resource_ref: true,
          },
        },
      },
      where: { question_id },
    });
    const {
      QuestionOptions: questionOptions,
      QuestionResources: questionRessources,
      ...questionData
    } = question;
    return {
      ...questionData,
      questionOptions,
      questionRessources,
    };
  }

  async getStudentAssessmentMarks(assessment_id: string) {
    const studentAssessmentMarks =
      await this.prismaService.annualStudentTakeAssessment.findMany({
        select: {
          total_score: true,
          submitted_at: true,
          annual_student_id: true,
          AnnualStudent: {
            select: {
              Student: {
                select: {
                  matricule: true,
                  Login: {
                    select: {
                      Person: { select: { first_name: true, last_name: true } },
                    },
                  },
                },
              },
            },
          },
        },
        where: { assessment_id },
      });
    return studentAssessmentMarks.map(
      ({
        AnnualStudent: {
          Student: {
            matricule,
            Login: {
              Person: { first_name, last_name },
            },
          },
        },
        ...data
      }) => ({
        ...data,
        matricule,
        fullname: `${first_name} ${last_name}`,
      })
    );
  }

  async getStudentAnswers(annual_student_id: string, assessment_id: string) {
    const annualStudent = await this.prismaService.annualStudent.findUnique({
      select: {
        Student: {
          select: {
            Login: {
              select: {
                Person: { select: { first_name: true, last_name: true } },
              },
            },
          },
        },
      },
      where: { annual_student_id },
    });
    if (!annualStudent)
      throw new HttpException(
        JSON.stringify(AUTH404('Student')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const studentAnswers =
      await this.prismaService.annualStudentAnswerOption.findMany({
        select: { answered_option_id: true, question_id: true },
        where: {
          AnnualStudentTakeAssessment: { annual_student_id, assessment_id },
        },
      });
    const questions = await this.prismaService.question.findMany({
      select: {
        question: true,
        question_id: true,
        question_mark: true,
        QuestionOptions: {
          select: {
            question_option_id: true,
            question_id: true,
            is_answer: true,
            option: true,
          },
        },
      },
      where: { assessment_id },
    });
    return studentAnswers.map(({ question_id, answered_option_id }) => {
      const {
        question,
        question_mark,
        QuestionOptions: questionOptions,
      } = questions.find((_) => _.question_id === question_id);
      return {
        question,
        question_id,
        question_mark,
        assessment_id,
        questionOptions,
        answered_option_id,
      };
    });
  }

  async getAssessmentStats(
    assessment_id: string,
    distribution_interval: number
  ) {
    const averageMark =
      await this.prismaService.annualStudentTakeAssessment.aggregate({
        _avg: { total_score: true },
        where: { assessment_id },
      });
    const studentMarks =
      await this.prismaService.annualStudentTakeAssessment.findMany({
        orderBy: { total_score: 'asc' },
        where: { assessment_id },
      });
    if (studentMarks.length === 0)
      throw new HttpException(
        JSON.stringify(AUTH404('StudentAssement')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const scoreDistributions: {
      number_of_students: number;
      average_score: number;
    }[] = [];
    let starting_bounds = 0;
    let ending_bounds = distribution_interval; //5 by default
    const bestScore = studentMarks[studentMarks.length - 1].total_score;
    do {
      const portion = studentMarks.filter(
        ({ total_score }) =>
          starting_bounds < total_score && total_score < ending_bounds
      );
      scoreDistributions.push({
        number_of_students: portion.length,
        average_score: portion.reduce(
          (avg, _) => avg + _.total_score / portion.length,
          0
        ),
      });
      starting_bounds = ending_bounds;
      ending_bounds =
        ending_bounds + distribution_interval > bestScore
          ? bestScore
          : ending_bounds + distribution_interval;
    } while (ending_bounds < bestScore);

    return {
      scoreDistributions,
      best_score: bestScore,
      distribution_interval,
      worst_score: studentMarks[0].total_score,
      average_score: averageMark._avg.total_score,
      total_number_of_students: studentMarks.length,
    };
  }

  async createAssessmentQuestion(
    newQuestion: QuestionPostDto,
    files: Array<Express.Multer.File>,
    created_by: string
  ) {
    const { assessment_id, questionOptions, ...questionData } = newQuestion;
    const assessment = await this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return await this.prismaService.question.create({
      data: {
        ...questionData,
        QuestionResources: {
          createMany: {
            data: files.map(({ filename }, index) => ({
              created_by,
              caption: index + 1,
              resource_ref: filename,
            })),
          },
        },
        QuestionOptions: {
          createMany: {
            data: questionOptions.map(({ is_answer, option }) => ({
              created_by,
              is_answer,
              option,
            })),
          },
        },
        Assessment: { connect: { assessment_id } },
        AnnualTeacher: { connect: { annual_teacher_id: created_by } },
      },
    });
  }

  async updateAssessmentQuestion(
    question_id: string,
    {
      question,
      question_mark,

      newOptions,
      editedOptions,
      deletedOptionIds,
      deletedResourceIds,
    }: QuestionPutDto,
    files: Array<Express.Multer.File>,
    audited_by: string
  ) {
    const questionData = await this.prismaService.question.findUnique({
      select: { question: true, question_mark: true, is_deleted: false },
      where: { question_id },
    });
    if (!questionData)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const instructions: PrismaPromise<unknown>[] = [];
    if (
      questionData?.question !== question ||
      questionData?.question_mark !== question_mark
    )
      instructions.push(
        this.prismaService.question.update({
          data: {
            question,
            question_mark,
            QuestionAudits: {
              create: {
                ...questionData,
                AnnualTeacher: { connect: { annual_teacher_id: audited_by } },
              },
            },
          },
          where: { question_id },
        })
      );
    if (newOptions.length > 0)
      instructions.push(
        this.prismaService.questionOption.createMany({
          data: newOptions.map((option) => ({
            ...option,
            question_id,
            created_by: audited_by,
          })),
        })
      );

    if (deletedOptionIds.length > 0 || editedOptions.length > 0) {
      const questionOptions = await this.prismaService.questionOption.findMany({
        select: {
          question_option_id: true,
          is_answer: true,
          option: true,
          is_deleted: true,
        },
        where: {
          OR: [
            ...deletedOptionIds,
            ...editedOptions.map((_) => _.question_option_id),
          ].map((question_option_id) => ({
            question_option_id,
          })),
        },
      });
      instructions.push(
        this.prismaService.questionOptionAudit.createMany({
          data: questionOptions.map((question) => ({
            ...question,
            audited_by,
          })),
        })
      );
      if (deletedOptionIds.length > 0)
        instructions.push(
          this.prismaService.questionOption.updateMany({
            data: { is_deleted: true },
            where: {
              OR: deletedOptionIds.map((question_option_id) => ({
                question_option_id,
              })),
            },
          })
        );
      if (editedOptions.length > 0)
        instructions.push(
          ...editedOptions.map(({ question_option_id, ...editedOption }) =>
            this.prismaService.questionOption.update({
              data: editedOption,
              where: { question_option_id },
            })
          )
        );
    }

    if (deletedResourceIds.length > 0)
      instructions.push(
        this.prismaService.questionResource.updateMany({
          data: {
            deleted_at: new Date(),
            deleted_by: audited_by,
          },
          where: {
            OR: deletedResourceIds.map((question_resource_id) => ({
              question_resource_id,
            })),
          },
        })
      );
    if (files.length > 0) {
      const caption = await this.prismaService.questionResource.count({
        where: { question_id },
      });
      instructions.push(
        this.prismaService.questionResource.createMany({
          data: files.map(({ filename }) => ({
            resource_ref: filename,
            caption: caption + 1,
            question_id,
            created_by: audited_by,
          })),
        })
      );
    }
    await this.prismaService.$transaction(instructions);
  }
}
