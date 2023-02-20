import { Injectable } from '@nestjs/common';
import {
  IDiscipline,
  Student as StudentInface,
  StudentDetail,
} from '@squoolr/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentQueryQto } from './student.dto';

@Injectable()
export class StudentService {
  constructor(private prismaService: PrismaService) {}

  async getStudents(
    academic_year_id: string,
    { classroom_code, major_code }: StudentQueryQto
  ): Promise<StudentInface[]> {
    const annualStudents = await this.prismaService.annualStudent.findMany({
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
                  (3.6 * 1e5),
              },
            ]
          : absences,
      []
    );
  }
}
