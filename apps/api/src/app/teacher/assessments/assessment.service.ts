import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AnnualStudentAnswerQuestion,
  Assessment,
  EvaluationHasStudent,
  Prisma,
  PrismaPromise,
} from '@prisma/client';
import {
  Assessment as IAssessment,
  GroupAssignmentDetails,
  IGroupAssignment,
  Question,
  QuestionAnswer as IQuestionAnswer,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { randomUUID } from 'crypto';
import {
  AUTH404,
  ERR18,
  ERR21,
  ERR22,
  ERR24,
  ERR25,
  ERR26,
} from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { QuestionAnswer } from '../courses/course.dto';
import {
  AssessmentPostDto,
  QuestionPostDto,
  QuestionPutDto,
} from '../teacher.dto';

@Injectable()
export class AssessmentService {
  private annualStudentTakeAssessmentSelect = {
    total_score: true,
    AnnualStudent: {
      select: {
        Student: {
          select: {
            matricule: true,
            Login: {
              select: {
                Person: {
                  select: { first_name: true, last_name: true },
                },
              },
            },
          },
        },
      },
    },
  };
  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {}

  async createAssessment(
    {
      annual_credit_unit_subject_id,
      submission_type,
      ...newAssessment
    }: AssessmentPostDto,
    created_by: string
  ) {
    const assessmentInput: Prisma.AssessmentCreateInput = {
      ...newAssessment,
      AnnualCreditUnitSubject: {
        connect: { annual_credit_unit_subject_id },
      },
      AnnualTeacher: { connect: { annual_teacher_id: created_by } },
    };
    if (submission_type === 'Individual')
      return this.prismaService.assessment.create({
        data: assessmentInput,
      });
    else {
      const assessment_id = randomUUID();
      const annualStudents: Prisma.AnnualStudentTakeAssessmentCreateManyInput[] =
        (
          await this.prismaService.annualStudent.findMany({
            select: { annual_student_id: true },
            where: {
              is_active: true,
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
          })
        ).map(({ annual_student_id }) => ({
          assessment_id,
          total_score: 0,
          annual_student_id,
          annual_student_take_assessment_id: randomUUID(),
        }));
      const groupCode = await this.codeGenerator.getGroupCode(
        annual_credit_unit_subject_id
      );
      return this.prismaService.$transaction([
        this.prismaService.annualStudentTakeAssessment.createMany({
          data: annualStudents,
          skipDuplicates: true,
        }),
        this.prismaService.assessment.create({
          data: {
            ...assessmentInput,
            AssignmentGroups: {
              createMany: {
                data: annualStudents.map(
                  ({ annual_student_take_assessment_id, ...groupMember }) => ({
                    ...groupMember,
                    group_code: groupCode,
                    annual_student_take_assessment_id,
                  })
                ),
                skipDuplicates: true,
              },
            },
          },
        }),
      ]);
    }
  }

  async getAssessment(
    assessment_id: string,
    is_student: boolean
  ): Promise<IAssessment> {
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
      if ((is_student && assessment.assessment_date) || !is_student) {
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
            Evaluation?.AnnualEvaluationSubType?.evaluation_sub_type_name ??
            null,
          total_mark: Questions.reduce(
            (total, _) => total + _.question_mark,
            0
          ),
        };
      }
    }
    return null;
  }

  async updateAssessment(
    assessment_id: string,
    { duration, ...newAssessment }: Prisma.AssessmentUpdateInput,
    audited_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: {
        duration: true,
        is_deleted: true,
        is_published: true,
        assessment_date: true,
        submission_type: true,
        number_per_group: true,
      },
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    if (duration && assessment.submission_type === 'Group')
      throw new HttpException(JSON.stringify(ERR22), HttpStatus.BAD_REQUEST);
    await this.prismaService.assessment.update({
      data: {
        ...newAssessment,
        AssessmentAudits: { create: { ...assessment, audited_by: audited_by } },
      },
      where: { assessment_id },
    });
  }

  async publishAssessment(
    assessment_id: string,
    audited_by: string,
    annual_evaluation_sub_type_id?: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: {
        duration: true,
        is_deleted: true,
        is_published: true,
        assessment_date: true,
        annual_credit_unit_subject_id: true,
      },
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const { annual_credit_unit_subject_id, ...assessmentData } = assessment;
    if (new Date() < new Date(assessmentData.assessment_date))
      throw new HttpException(
        JSON.stringify(ERR18),
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const publishMarksInstructions: PrismaPromise<
      EvaluationHasStudent | Assessment
    >[] = [];
    if (annual_evaluation_sub_type_id) {
      const evaluation = await this.prismaService.evaluation.findFirst({
        where: {
          annual_evaluation_sub_type_id,
          annual_credit_unit_subject_id,
        },
      });
      if (!evaluation)
        throw new HttpException(
          JSON.stringify(AUTH404('Evaluation')),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
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
          where: { evaluation_id: evaluation?.evaluation_id },
        });
      const studentAssessmentMarks =
        await this.prismaService.annualStudentTakeAssessment.findMany({
          select: { annual_student_id: true, total_score: true },
          where: { assessment_id },
        });
      if (studentAssessmentMarks.length > 0)
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
              ...assessmentData,
              AnnualTeacher: { connect: { annual_teacher_id: audited_by } },
            },
          },
        },
      }),
      ...publishMarksInstructions,
    ]);
  }

  async getAssessmentQuestions(
    assessment_id: string,
    is_student: boolean
  ): Promise<Question[]> {
    const assessment = await this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
    if (!assessment || (is_student && !assessment.assessment_date))
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.NOT_FOUND
      );
    const { assessment_date, duration } = assessment;
    const assessmentEndDate = new Date(
      new Date(assessment_date).getTime() + duration * 60 * 1000
    );
    const questions = await this.prismaService.question.findMany({
      select: {
        question: true,
        question_id: true,
        question_mark: true,
        question_type: true,
        question_answer: true,
        QuestionOptions: {
          select: {
            question_option_id: true,
            question_id: true,
            option: true,
            is_answer:
              !is_student || (is_student && new Date() < assessmentEndDate),
          },
          where: { is_deleted: false },
        },
        QuestionResources: {
          select: {
            question_resource_id: true,
            question_id: true,
            resource_ref: true,
            deleted_at: true,
            caption: true,
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
        assessment_id,
        questionOptions,
        questionResources: questionRessources.filter(
          (_) => _.deleted_at === null
        ),
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

  async getAssessmentSubmissions(
    assessment_id: string
  ): Promise<(StudentAssessmentAnswer | IGroupAssignment)[]> {
    const assessment = await this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.NOT_FOUND
      );
    const { submission_type } = assessment;
    if (submission_type === 'Individual') {
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
                        Person: {
                          select: { first_name: true, last_name: true },
                        },
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
          questionAnswers: [],
          fullname: `${first_name} ${last_name}`,
        })
      );
    } else {
      const assignmentGroups =
        await this.prismaService.assignmentGroupMember.findMany({
          distinct: ['group_code'],
          select: {
            group_code: true,
            total_score: true,
            has_submitted: true,
            assessment_id: true,
            assignment_group_id: true,
          },
          where: { assessment_id },
        });
      const groups = await this.prismaService.assignmentGroupMember.groupBy({
        _count: true,
        by: ['group_code'],
        where: { assessment_id },
      });
      return assignmentGroups.map(({ has_submitted, ...group }) => ({
        ...group,
        is_submitted: has_submitted,
        number_of_students: groups.find(
          (_) => _.group_code === group.group_code
        )._count,
      }));
    }
  }

  async getStudentAnswers(
    annual_student_id: string,
    assessment_id: string
  ): Promise<IQuestionAnswer[]> {
    const annualStudent =
      await this.prismaService.annualStudentTakeAssessment.findFirst({
        select: this.annualStudentTakeAssessmentSelect,
        where: { annual_student_id, assessment_id },
      });
    if (!annualStudent)
      throw new HttpException(
        JSON.stringify(AUTH404('Student')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    const studentAnswers =
      await this.prismaService.annualStudentAnswerQuestion.findMany({
        where: {
          AnnualStudentTakeAssessment: { annual_student_id, assessment_id },
        },
      });
    const questions = await this.getAssessmentQuestions(assessment_id, false);
    return this.getQuestionAnswerObjects(
      assessment_id,
      questions,
      studentAnswers
    );
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
      return {
        best_score: 0,
        worst_score: 0,
        average_score: 0,
        distribution_interval,
        scoreDistributions: [],
        total_number_of_students: 0,
      };
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
    {
      assessment_id,
      question_type,
      questionOptions,
      ...questionData
    }: QuestionPostDto,
    created_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
    if (!assessment)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    if (assessment.submission_type === 'Individual' && question_type === 'File')
      throw new HttpException(JSON.stringify(ERR26), HttpStatus.BAD_REQUEST);
    return await this.prismaService.question.create({
      data: {
        question_type,
        ...questionData,
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

  async createQuestionResources(
    question_id: string,
    files: Array<Express.Multer.File>,
    created_by: string
  ) {
    const caption = await this.prismaService.questionResource.count({
      where: { question_id },
    });
    await this.prismaService.questionResource.createMany({
      data: files.map(({ filename }, index) => ({
        created_by,
        question_id,
        caption: caption + index + 1,
        resource_ref: filename,
      })),
    });
    return this.prismaService.questionResource.findMany({
      select: {
        caption: true,
        resource_ref: true,
        question_resource_id: true,
      },
      where: { question_id },
    });
  }

  async updateQuestion(
    question_id: string,
    {
      question,
      question_mark,

      newOptions,
      editedOptions,
      deletedOptionIds,
      deletedResourceIds,
    }: QuestionPutDto,
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
    await this.prismaService.$transaction(instructions);
  }

  async deleteQuestion(question_id: string, audited_by: string) {
    const question = await this.prismaService.question.findUnique({
      select: { question: true, question_mark: true, is_deleted: true },
      where: { question_id },
    });
    await this.prismaService.question.update({
      data: {
        is_deleted: true,
        QuestionAudits: { create: { ...question, audited_by } },
      },
      where: { question_id },
    });
  }

  async takeAssessment(annual_student_id: string, assessment_id: string) {
    const assessment = await this.prismaService.assessment.findFirst({
      where: { assessment_id },
    });
    if (!assessment || !assessment.assessment_date)
      throw new HttpException(
        JSON.stringify(AUTH404('Assessment')),
        HttpStatus.NOT_FOUND
      );
    if (assessment.submission_type === 'Individual') {
      await this.prismaService.annualStudentTakeAssessment.create({
        data: {
          total_score: 0,
          Assessment: { connect: { assessment_id } },
          AnnualStudent: { connect: { annual_student_id } },
        },
      });

      const { assessment_date, duration } = assessment;
      const allowedDate = new Date(
        new Date(assessment_date).getTime() + (duration / 8) * 60 * 1000
      );
      if (allowedDate < new Date())
        throw new HttpException(JSON.stringify(ERR21), HttpStatus.EARLYHINTS);
    }
  }

  async submitStudentAnswers(
    annual_student_id: string,
    assessment_id: string,
    studentAnswers: QuestionAnswer[],
    responseFiles: Array<Express.Multer.File>
  ) {
    let annualStudentAnswerQuestionAudits: Prisma.AnnualStudentAnswerQuestionAuditCreateManyInput[] =
      [];
    const auditedQuestions: {
      question_id: string;
      annual_student_answer_question_id: string;
    }[] = [];
    const {
      created_at,
      submitted_at,
      AssignmentGroups: groupIds,
      annual_student_take_assessment_id,
      Assessment: { assessment_date, submission_type, duration },
    } = await this.prismaService.annualStudentTakeAssessment.findFirstOrThrow({
      select: {
        created_at: true,
        submitted_at: true,
        annual_student_take_assessment_id: true,
        Assessment: {
          select: {
            assessment_date: true,
            submission_type: true,
            duration: true,
          },
        },
        AssignmentGroups: {
          select: { group_code: true },
          where: { assessment_id },
        },
      },
      where: { annual_student_id, assessment_id },
    });
    if (submission_type === 'Individual') {
      const allowedDate = new Date(
        new Date(assessment_date).getTime() + (duration / 8) * 60 * 1000
      );
      if (allowedDate < new Date(created_at))
        throw new HttpException(JSON.stringify(ERR21), HttpStatus.EARLYHINTS);
      if (submitted_at)
        throw new HttpException(JSON.stringify(ERR25), HttpStatus.BAD_REQUEST);
    } else {
      if (new Date() > new Date(assessment_date))
        throw new HttpException(JSON.stringify(ERR21), HttpStatus.EARLYHINTS);

      const studentResponses =
        await this.prismaService.annualStudentAnswerQuestion.findMany({
          select: {
            annual_student_answer_question_id: true,
            annual_student_take_assessment_id: true,
            question_id: true,
            response: true,
          },
          where: {
            AnnualStudentTakeAssessment: {
              AssignmentGroups: {
                some: {
                  assessment_id,
                  OR: groupIds.map(({ group_code }) => ({
                    group_code,
                  })),
                },
              },
            },
            OR: studentAnswers.map(({ question_id }) => ({ question_id })),
          },
        });
      annualStudentAnswerQuestionAudits = studentResponses.map(
        ({
          response,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          question_id,
          annual_student_take_assessment_id: previous_auditer,
          annual_student_answer_question_id,
        }) => {
          auditedQuestions.push({
            question_id,
            annual_student_answer_question_id,
          });
          return {
            response,
            previous_auditer,
            annual_student_answer_question_id,
            audited_by: annual_student_take_assessment_id,
          };
        }
      );
    }

    const assessmentQuestions = await this.getAssessmentQuestions(
      assessment_id,
      false
    );

    let totalScore = 0;
    const studentAnswerQuestionUpdateQueries: {
      data: Prisma.AnnualStudentAnswerQuestionUpdateInput;
      id: string;
    }[] = [];
    const studentAnswerQuestionCreateInputs: Prisma.AnnualStudentAnswerQuestionCreateManyInput[] =
      [];
    studentAnswers.forEach(({ question_id, answered_option_id, response }) => {
      const {
        question_type,
        question_mark,
        questionOptions,
        question_id: questionId,
      } = assessmentQuestions.find((_) => _.question_id === question_id);
      if (question_type === 'File') {
        const responseFile = responseFiles.find(
          (_) => _.originalname === questionId
        );
        if (!responseFile)
          throw new HttpException(
            JSON.stringify(ERR24),
            HttpStatus.BAD_REQUEST
          );
        response = responseFile.fieldname;
      }
      const questionMark =
        question_type === 'MCQ'
          ? questionOptions.find((_) => _.is_answer)?.question_option_id ===
            answered_option_id
            ? question_mark
            : 0
          : null;
      totalScore += questionMark ?? 0;
      const newQuestionAnswer = {
        response,
        question_id,
        answered_option_id,
        question_mark: questionMark,
        annual_student_take_assessment_id,
      };
      const question = auditedQuestions.find(
        (_) => _.question_id === question_id
      );
      if (question)
        studentAnswerQuestionUpdateQueries.push({
          data: {
            response,
            QuestionOption: {
              connect: { question_option_id: answered_option_id },
            },
            AnnualStudentTakeAssessment: {
              connect: { annual_student_take_assessment_id },
            },
          },
          id: question.annual_student_answer_question_id,
        });
      else studentAnswerQuestionCreateInputs.push(newQuestionAnswer);
    });

    await this.prismaService.$transaction([
      ...studentAnswerQuestionUpdateQueries.map(({ id, data }) =>
        this.prismaService.annualStudentAnswerQuestion.update({
          data,
          where: { annual_student_answer_question_id: id },
        })
      ),
      this.prismaService.annualStudentAnswerQuestionAudit.createMany({
        data: annualStudentAnswerQuestionAudits,
      }),
      this.prismaService.annualStudentAnswerQuestion.createMany({
        data: studentAnswerQuestionCreateInputs,
        skipDuplicates: true,
      }),
      this.prismaService.annualStudentTakeAssessment.update({
        data: {
          submitted_at: new Date(),
          total_score: totalScore,
        },
        where: { annual_student_take_assessment_id },
      }),
    ]);
  }

  async getGroupAssignmentDetails(
    assessment_id: string,
    group_code: string
  ): Promise<GroupAssignmentDetails> {
    const groupMembers =
      await this.prismaService.assignmentGroupMember.findMany({
        select: {
          total_score: true,
          has_approved: true,
          has_submitted: true,
          annual_student_take_assessment_id: true,
          AnnualStudentTakeAssessment: {
            select: this.annualStudentTakeAssessmentSelect,
          },
        },
        where: { group_code, assessment_id },
      });
    const studentAssignmentAnswers =
      await this.prismaService.annualStudentAnswerQuestion.findMany({
        where: {
          OR: groupMembers.map(({ annual_student_take_assessment_id }) => ({
            annual_student_take_assessment_id,
          })),
        },
      });
    const questions = await this.getAssessmentQuestions(assessment_id, false);
    return {
      group_code,
      assessment_id,
      number_of_students: 0,
      total_score: groupMembers.length > 0 ? groupMembers[0].total_score : 0,
      is_submitted: groupMembers.reduce(
        (isSubmitted, { has_submitted }) => isSubmitted && has_submitted,
        true
      ),
      members: groupMembers.map(
        ({
          has_approved,
          AnnualStudentTakeAssessment: {
            total_score,
            AnnualStudent: {
              Student: {
                matricule,
                Login: {
                  Person: { first_name, last_name },
                },
              },
            },
          },
        }) => ({ has_approved, first_name, last_name, matricule, total_score })
      ),
      answers: this.getQuestionAnswerObjects(
        assessment_id,
        questions,
        studentAssignmentAnswers
      ),
    };
  }

  private getQuestionAnswerObjects(
    assessment_id: string,
    questions: Question[],
    answeredQuestionIds: AnnualStudentAnswerQuestion[]
  ): IQuestionAnswer[] {
    return questions.map(
      ({
        question_id,
        question,
        question_type,
        questionOptions,
        questionResources,
        question_answer,
      }) => {
        const { response, teacher_comment, question_mark } =
          answeredQuestionIds.find((_) => _.question_id === question_id);
        return {
          question,
          question_id,
          question_mark,
          assessment_id,
          question_type,
          question_answer,
          questionResources,
          response: question_type !== 'MCQ' ? response : null,
          teacher_comment: question_type !== 'MCQ' ? teacher_comment : null,
          questionOptions: question_type === 'MCQ' ? questionOptions : [],
          answeredOptionIds:
            question_type === 'MCQ'
              ? answeredQuestionIds
                  .filter((_) => _.question_id === question_id)
                  .map((_) => _.answered_option_id)
              : [],
        };
      }
    );
  }
}
