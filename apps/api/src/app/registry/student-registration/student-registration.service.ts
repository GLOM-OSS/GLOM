import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Student, StudentDetail } from '@squoolr/interfaces';
import * as bcrypt from 'bcrypt';
import { AUTH404 } from '../../../../src/errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { StudentQueryQto } from '../registry.dto';

export interface StudentImportInterface {
  matricule: string;
  email: string;
  birthdate: Date;
  address?: string;
  religion?: string;
  handicap?: string;
  last_name: string;
  first_name: string;
  birthplace?: string;
  nationality?: string;
  home_region?: string;
  phone_number: string;
  gender: 'Male' | 'Female';
  national_id_number: string;
  civil_status?: 'Married' | 'Single' | 'Divorced';
  employment_status: 'Employed' | 'Unemployed' | 'SelfEmployed';

  tutor_email: string;
  tutor_address: string;
  tutor_lastname: string;
  tutor_firstname: string;
  tutor_birthdate: string;
  tutor_nationality: string;
  tutor_phone_number: string;
  tutor_gender: 'Male' | 'Female';
  tutor_national_id_number: string;
}
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

  async getStudentDetails(
    annual_student_id: string
  ): Promise<StudentDetail | null> {
    const annualStudent = await this.prismaService.annualStudent.findUnique({
      select: {
        annual_student_id: true,
        Student: {
          select: {
            matricule: true,
            Tutor: { select: { Person: true } },
            Login: { select: { Person: true } },
          },
        },
      },
      where: {
        annual_student_id,
      },
    });
    if (annualStudent) {
      const {
        annual_student_id,
        Student: {
          matricule,
          Login: { Person: person },
          Tutor: { Person: tutorInfo },
        },
      } = annualStudent;
      return {
        matricule,
        ...person,
        tutorInfo,
        annual_student_id,
      };
    }
    return null;
  }

  async registerNewStudents(
    major_id: string,
    academic_year_id: string,
    importedStudentData: StudentImportInterface[]
  ) {
    const classroomDivision =
      await this.prismaService.annualClassroomDivision.findFirst({
        select: {
          annual_classroom_division_id: true,
          AnnualClassroom: { select: { classroom_code: true } },
        },
        where: { AnnualClassroom: { Classroom: { major_id, level: 1 } } },
      });
    if (!classroomDivision)
      throw new HttpException(
        JSON.stringify(AUTH404('Classroom divisions')),
        HttpStatus.NOT_FOUND
      );
    const {
      AnnualClassroom: { classroom_code },
      annual_classroom_division_id,
    } = classroomDivision;
    return Promise.all(
      importedStudentData.map(
        ({
          tutor_address,
          tutor_email,
          tutor_firstname,
          tutor_lastname,
          tutor_nationality,
          tutor_birthdate,
          tutor_gender,
          tutor_phone_number,
          tutor_national_id_number,

          matricule,
          birthdate,
          ...person
        }) => {
          console.log(person);
          return this.prismaService.annualStudent.create({
            data: {
              Student: {
                connectOrCreate: {
                  create: {
                    matricule,
                    Classroom: { connect: { classroom_code } },
                    Tutor: {
                      create: {
                        password: bcrypt.hashSync(
                          'tutor-password',
                          Number(process.env.SALT)
                        ),
                        Person: {
                          connectOrCreate: {
                            create: {
                              email: tutor_email,
                              gender: tutor_gender,
                              address: tutor_address,
                              last_name: tutor_lastname,
                              first_name: tutor_firstname,
                              nationality: tutor_nationality,
                              phone_number: tutor_phone_number,
                              birthdate: new Date(tutor_birthdate),
                              national_id_number: tutor_national_id_number,
                            },
                            where: {
                              email: tutor_email,
                            },
                          },
                        },
                      },
                    },
                    Login: {
                      create: {
                        password: bcrypt.hashSync(
                          'student-password',
                          Number(process.env.SALT)
                        ),
                        Person: {
                          connectOrCreate: {
                            create: {
                              ...person,
                              birthdate: new Date(birthdate),
                            },
                            where: { email: person.email },
                          },
                        },
                      },
                    },
                  },
                  where: { matricule },
                },
              },
              AnnualClassroomDivision: {
                connect: {
                  annual_classroom_division_id,
                },
              },
              AcademicYear: { connect: { academic_year_id } },
            },
          });
        }
      )
    );
  }
}
