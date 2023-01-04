import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404, ERR18 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { AssessmentPutDto, PublishAssessmentDto } from '../teacher.dto';

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
    return this.prismaService.assessment.findUnique({
      where: { assessment_id },
    });
  }

  async updateAssessment(
    assessment_id: string,
    newAssessment: AssessmentPutDto,
    audited_by: string
  ) {
    const assessment = await this.prismaService.assessment.findUnique({
      select: { assessment_date: true, duration: true, is_deleted: true },
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
      select: { assessment_date: true, duration: true, is_deleted: true },
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

    const publishMarksInstructions = evaluationHasStudentAudits.map((_) => {
      const { total_score, annual_student_id } = studentAssessmentMarks.find(
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
    });
    return this.prismaService.$transaction(publishMarksInstructions);
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
      },
      where: {
        assessment_id,
        is_deleted: false,
        QuestionOptions: { some: { is_deleted: false } },
      },
    });
    return questions.map(
      ({ QuestionOptions: questionOptions, ...question }) => ({
        ...question,
        questionOptions,
        questionRessources: [],
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
          select: { question_resource_id: true, resource_ref: true },
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
}
