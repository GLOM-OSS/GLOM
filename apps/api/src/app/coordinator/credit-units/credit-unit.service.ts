import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EvaluationSubTypeEnum, Prisma } from '@prisma/client';
import { UEMajor } from '@squoolr/interfaces';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { EvaluationsQeuryDto } from '../../teacher/teacher.dto';
import { CreditUnitPostDto, CreditUnitQuery } from '../coordinator.dto';

@Injectable()
export class CreditUnitService {
  constructor(private prismaService: PrismaService) {}

  async getCoordinatorMajors(classroomDivisions: string[]): Promise<UEMajor[]> {
    const majors = await this.prismaService.annualClassroomDivision.findMany({
      select: {
        AnnualClassroom: {
          select: {
            Classroom: {
              select: {
                Major: {
                  select: {
                    major_id: true,
                    major_code: true,
                    major_name: true,
                    Cycle: { select: { number_of_years: true } },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        is_deleted: false,
        OR: classroomDivisions.map((annual_classroom_division_id) => ({
          annual_classroom_division_id,
        })),
      },
    });
    const coordiantorMajors: UEMajor[] = [];
    majors.forEach(
      ({
        AnnualClassroom: {
          Classroom: {
            Major: {
              major_id,
              major_name,
              major_code,
              Cycle: { number_of_years },
            },
          },
        },
      }) => {
        if (!coordiantorMajors.find((_) => _.major_id === major_id))
          coordiantorMajors.push({
            major_id,
            major_code,
            number_of_years,
            major_name,
          });
      }
    );
    return coordiantorMajors;
  }

  async getCreditUnits({ majorIds, semester_number }: CreditUnitQuery) {
    return this.prismaService.annualCreditUnit.findMany({
      select: {
        annual_credit_unit_id: true,
        credit_unit_code: true,
        credit_unit_name: true,
        semester_number: true,
        credit_points: true,
      },
      where: {
        semester_number,
        is_deleted: false,
        ...(majorIds && majorIds.length > 0
          ? { Major: { Classrooms: { some: { OR: majorIds } } } }
          : {}),
      },
    });
  }

  async getCreditUnitDetails(credit_unit_id_or_code: string) {
    return this.prismaService.annualCreditUnit.findFirst({
      where: {
        OR: [
          { annual_credit_unit_id: credit_unit_id_or_code },
          { credit_unit_code: credit_unit_id_or_code },
        ],
      },
    });
  }

  async createCreditUnit(
    { major_id, credit_unit_code, ...newCreditUnit }: CreditUnitPostDto,
    metaData: {
      academic_year_id: string;
      annual_teacher_id: string;
    }
  ) {
    const { academic_year_id, annual_teacher_id } = metaData;

    return this.prismaService.annualCreditUnit.create({
      data: {
        ...newCreditUnit,
        credit_unit_code,
        Major: { connect: { major_id } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualTeacher: { connect: { annual_teacher_id } },
      },
    });
  }

  async updateCreditUnit(
    annual_credit_unit_id: string,
    updateData: Prisma.AnnualCreditUnitUpdateInput,
    annual_teacher_id: string
  ) {
    const creditUnit = await this.prismaService.annualCreditUnit.findUnique({
      select: {
        is_deleted: true,
        credit_points: true,
        semester_number: true,
        credit_unit_code: true,
        credit_unit_name: true,
        is_exam_published: true,
        is_resit_published: true,
      },
      where: { annual_credit_unit_id },
    });
    if (!creditUnit)
      throw new HttpException(
        JSON.stringify(AUTH404('Credi Unit')),
        HttpStatus.NOT_FOUND
      );
    return this.prismaService.annualCreditUnit.update({
      data: {
        ...updateData,
        AnnualCreditUnitAudits: {
          create: {
            ...creditUnit,
            audited_by: annual_teacher_id,
          },
        },
      },
      where: { annual_credit_unit_id },
    });
  }

  async getCreditUnitMarkStatus(
    academic_year_id: string,
    {
      annual_credit_unit_subject_id,
      major_code,
      ...evaluationQuery
    }: EvaluationsQeuryDto
  ) {
    const annualCreditUnits =
      await this.prismaService.annualCreditUnit.findMany({
        select: {
          credit_points: true,
          credit_unit_code: true,
          credit_unit_name: true,
          annual_credit_unit_id: true,
          AnnualCreditUnitSubjects: {
            select: {
              subject_code: true,
              subject_title: true,
              annual_credit_unit_subject_id: true,
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
            },
          },
        },
        where: {
          ...evaluationQuery,
          Major: { major_code },
          AnnualCreditUnitSubjects: {
            some: { annual_credit_unit_subject_id },
          },
        },
      });
    const activeYear = await this.prismaService.academicYear.findUnique({
      where: { academic_year_id },
    });
    return annualCreditUnits.map(
      ({ AnnualCreditUnitSubjects, ...creditUnit }) => {
        const subjectMarkStatus = AnnualCreditUnitSubjects.map(
          ({ Evaluations, ...subject }) => {
            const resitEvaluation = Evaluations.find(
              ({ AnnualEvaluationSubType: { evaluation_sub_type_name } }) =>
                evaluation_sub_type_name === EvaluationSubTypeEnum.RESIT
            );
            return {
              ...subject,
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
                activeYear.ended_at ?? resitEvaluation?.examination_date
                  ? (new Date(resitEvaluation.examination_date) < new Date() &&
                      resitEvaluation.EvaluationHasStudents.length === 0) ??
                      resitEvaluation.published_at
                  : false
              ),
            };
          }
        );
        const totalAvailableMarks = subjectMarkStatus.reduce(
          (
            total,
            { is_resit_available, is_exam_available, is_ca_available }
          ) => {
            if (is_ca_available) total++;
            if (is_resit_available) total++;
            if (is_exam_available) total++;
            return total;
          },
          0
        );
        return {
          ...creditUnit,
          subjectMarkStatus,
          availability_percentage:
            (totalAvailableMarks * 100) / (subjectMarkStatus.length * 3),
        };
      }
    );
  }

  async publishCreditUnit(annual_credit_unit_id: string, published_by: string) {
    const creditUnit = await this.prismaService.annualCreditUnit.findUnique({
      select: {
        is_deleted: true,
        credit_points: true,
        semester_number: true,
        credit_unit_code: true,
        credit_unit_name: true,
        is_exam_published: true,
        is_resit_published: true,
      },
      where: { annual_credit_unit_id },
    });
    if (
      !creditUnit ||
      (creditUnit.is_exam_published && creditUnit.is_resit_published)
    )
      throw new HttpException(
        JSON.stringify(AUTH404('Credit Unit')),
        HttpStatus.NOT_FOUND
      );

    await this.prismaService.annualCreditUnit.update({
      data: {
        ...(creditUnit.is_exam_published
          ? { is_resit_published: true }
          : { is_exam_published: true }),
        AnnualCreditUnitAudits: {
          create: {
            ...creditUnit,
            audited_by: published_by,
          },
        },
      },
      where: { annual_credit_unit_id },
    });
  }
}
