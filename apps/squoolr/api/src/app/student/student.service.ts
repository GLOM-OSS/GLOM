import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IDiscipline,
  IFeeSummary,
  IPaymentHistory,
  Student as StudentInface,
  StudentDetail,
} from '@squoolr/interfaces';
import { AUTH404, ERR34 } from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto, StudentQueryQto } from './student.dto';

@Injectable()
export class StudentService {
  constructor(private prismaService: PrismaService) {}

  async getStudents(
    academic_year_id: string,
    { classroom_code, major_code }: StudentQueryQto
  ): Promise<StudentInface[]> {
    const annualStudents = await this.prismaService.annualStudent.findMany({
      distinct: 'student_id',
      select: {
        is_active: true,
        annual_student_id: true,
        Student: {
          select: { matricule: true, Login: { select: { Person: true } } },
        },
        AnnualClassroomDivision: {
          select: { AnnualClassroom: { select: { classroom_acronym: true } } },
        },
      },
      where: {
        academic_year_id,
        AnnualClassroomDivision: {
          AnnualClassroom: {
            classroom_code,
            Classroom: { Major: { major_code } },
          },
        },
      },
    });
    return annualStudents.map(
      ({
        is_active,
        annual_student_id,
        Student: {
          matricule,
          Login: { Person: person },
        },
        AnnualClassroomDivision: {
          AnnualClassroom: { classroom_acronym },
        },
      }) => ({
        matricule,
        ...person,
        is_active,
        annual_student_id,
        classroom_acronym,
      })
    );
  }

  async getStudentDetails(
    annual_student_id: string
  ): Promise<StudentDetail | null> {
    const annualStudent = await this.prismaService.annualStudent.findUnique({
      select: {
        is_active: true,
        annual_student_id: true,
        Student: {
          select: {
            matricule: true,
            Tutor: { select: { Person: true } },
            Login: { select: { Person: true } },
          },
        },
        AnnualClassroomDivision: {
          select: {
            AnnualClassroom: { select: { classroom_acronym: true } },
          },
        },
      },
      where: {
        annual_student_id,
      },
    });
    if (annualStudent) {
      const {
        is_active,
        annual_student_id,
        Student: {
          matricule,
          Login: { Person: person },
          Tutor: { Person: tutorInfo },
        },
        AnnualClassroomDivision: {
          AnnualClassroom: { classroom_acronym },
        },
      } = annualStudent;
      return {
        matricule,
        ...person,
        tutorInfo,
        is_active,
        annual_student_id,
        classroom_acronym,
      };
    }
    return null;
  }

  async getStudentAbsences(
    academic_year_id: string,
    annual_student_id: string
  ): Promise<IDiscipline[]> {
    const presenceLists = await this.prismaService.presenceList.findMany({
      select: {
        end_time: true,
        start_time: true,
        presence_list_date: true,
        AnnualCreditUnitSubject: { select: { subject_title: true } },
        PresenceListHasCreditUnitStudents: {
          select: {
            AnnualStudentHasCreditUnit: { select: { annual_student_id: true } },
          },
        },
      },
      where: {
        AnnualCreditUnitSubject: {
          AnnualCreditUnit: {
            academic_year_id,
            AnnualStudentHasCreditUnits: { some: { annual_student_id } },
          },
        },
      },
    });
    return presenceLists.reduce<IDiscipline[]>(
      (
        absences,
        {
          end_time,
          start_time,
          presence_list_date,
          AnnualCreditUnitSubject: { subject_title },
          PresenceListHasCreditUnitStudents: presentStudents,
        }
      ) =>
        presentStudents.findIndex(
          ({ AnnualStudentHasCreditUnit: _ }) =>
            _.annual_student_id === annual_student_id
        ) == -1
          ? [
              ...absences,
              {
                subject_title,
                presence_list_date,
                absences:
                  (new Date(end_time).getTime() -
                    new Date(start_time).getTime()) /
                  (3.6 * 1e6),
              },
            ]
          : absences,
      []
    );
  }

  async getStudentFeeSummary(
    annual_student_id: string,
    numberOfSemesters: number
  ): Promise<IFeeSummary> {
    const annualStudent = await this.prismaService.annualStudent.findUnique({
      select: {
        AnnualClassroomDivision: {
          select: {
            AnnualClassroom: {
              select: { registration_fee: true, total_fee_due: true },
            },
          },
        },
      },
      where: { annual_student_id },
    });
    if (!annualStudent)
      throw new HttpException(
        JSON.stringify(AUTH404('Student')),
        HttpStatus.NOT_FOUND
      );
    const {
      AnnualClassroomDivision: {
        AnnualClassroom: { registration_fee, total_fee_due },
      },
    } = annualStudent;
    const paymentHistories = await this.prismaService.payment.findMany({
      where: { annual_student_id },
    });
    const total_due =
      total_fee_due +
      registration_fee +
      Number(process.env.PLATFORM_FEE) * numberOfSemesters;
    const total_paid = paymentHistories.reduce(
      (total, { amount }) => total + amount,
      0
    );
    return {
      total_due,
      total_paid,
      paymentHistories,
      registration: registration_fee,
      total_owing: total_due - total_paid,
    };
  }

  async payStudentFee(
    {
      annual_student_id,
      transaction_id,
      semesterNumbers,
      ...newPayment
    }: CreatePaymentDto,
    paid_by: string
  ): Promise<IPaymentHistory[]> {
    const {
      AnnualStudentHasCreditUnits: distinctSemesters,
      AnnualClassroomDivision: {
        AnnualClassroom: { registration_fee, total_fee_due },
      },
    } = await this.prismaService.annualStudent.findUniqueOrThrow({
      select: {
        AnnualClassroomDivision: {
          select: {
            AnnualClassroom: {
              select: { registration_fee: true, total_fee_due: true },
            },
          },
        },
        AnnualStudentHasCreditUnits: {
          distinct: 'semester_number',
        },
      },
      where: { annual_student_id },
    });
    const {
      _sum: { amount },
    } = await this.prismaService.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: { annual_student_id },
    });
    const amountDue =
      Number(process.env.PLATFORM_FEE) * distinctSemesters.length +
      registration_fee +
      total_fee_due -
      amount;
    if (newPayment.amount > amountDue)
      throw new HttpException(
        JSON.stringify(ERR34(amountDue)),
        HttpStatus.BAD_REQUEST
      );
    await this.prismaService.payment.createMany({
      data:
        newPayment.payment_reason === 'Platform'
          ? semesterNumbers.map((semester_number) => ({
              paid_by,
              ...newPayment,
              amount: newPayment.amount / semesterNumbers.length,
              transaction_id,
              semester_number,
              annual_student_id,
            }))
          : [
              {
                paid_by,
                ...newPayment,
                transaction_id,
                annual_student_id,
              },
            ],
    });
    return this.prismaService.payment.findMany({
      where: { transaction_id },
    });
  }
}
