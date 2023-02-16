import { Injectable } from '@nestjs/common';
import { Student } from '@squoolr/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { StudentQueryQto } from '../registry.dto';

@Injectable()
export class StudentRegistrationService {
  constructor(private prismaService: PrismaService) {}

  async getStudents(
    academic_year_id: string,
    { classroom_code, major_code }: StudentQueryQto
  ): Promise<Student[]> {
    const annualStudents = await this.prismaService.annualStudent.findMany({
      select: {
        annual_student_id: true,
        Student: {
          select: { matricule: true, Login: { select: { Person: true } } },
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
        annual_student_id,
        Student: {
          matricule,
          Login: { Person: person },
        },
      }) => ({
        matricule,
        ...person,
        annual_student_id,
      })
    );
  }
}
