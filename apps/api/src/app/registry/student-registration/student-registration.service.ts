import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnnualStudent, Person, PrismaPromise, Student } from '@prisma/client';
import { Student as StudentInface, StudentDetail } from '@squoolr/interfaces';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
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
  ): Promise<StudentInface[]> {
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
    school_id: string,
    academic_year_id: string,
    major_id: string,
    importedStudentData: StudentImportInterface[]
  ) {
    const classroomDivision =
      await this.prismaService.annualClassroomDivision.findFirst({
        select: {
          annual_classroom_division_id: true,
          AnnualClassroom: { select: { classroom_id: true } },
        },
        where: { AnnualClassroom: { Classroom: { major_id, level: 1 } } },
      });
    if (!classroomDivision)
      throw new HttpException(
        JSON.stringify(AUTH404('Classroom divisions')),
        HttpStatus.NOT_FOUND
      );
    const {
      AnnualClassroom: { classroom_id },
      annual_classroom_division_id,
    } = classroomDivision;
    const queryInstructions: PrismaPromise<Person | Student | AnnualStudent>[] =
      [];
    await Promise.all(
      importedStudentData.map(
        async ({
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
          phone_number,
          national_id_number,
          ...person
        }) => {
          const studentPerson = await this.prismaService.person.findUnique({
            where: { email: person.email },
          });
          const tutorPerson = await this.prismaService.person.findUnique({
            select: {
              person_id: true,
              Logins: {
                select: { login_id: true },
                where: { school_id: null },
              },
            },
            where: { email: tutor_email },
          });
          const newStudentPerson = {
            ...person,
            birthdate: new Date(birthdate),
            phone_number: phone_number.toString(),
            national_id_number: national_id_number.toString(),
            person_id: studentPerson?.person_id ?? randomUUID(),
          };
          const newTutorPerson = {
            email: tutor_email,
            gender: tutor_gender,
            address: tutor_address,
            last_name: tutor_lastname,
            first_name: tutor_firstname,
            nationality: tutor_nationality,
            birthdate: new Date(tutor_birthdate),
            phone_number: tutor_phone_number.toString(),
            national_id_number: tutor_national_id_number.toString(),
            person_id: tutorPerson?.person_id ?? randomUUID(),
          };
          queryInstructions.push(
            this.prismaService.person.upsert({
              create: {
                ...newStudentPerson,
                Logins: {
                  create: {
                    password: bcrypt.hashSync(
                      'student-password',
                      Number(process.env.SALT)
                    ),
                    School: { connect: { school_id } },
                  },
                },
              },
              update: newStudentPerson,
              where: { email: person.email },
            }),
            this.prismaService.person.upsert({
              create: {
                ...newTutorPerson,
                Logins: {
                  create: {
                    is_parent: true,
                    password: bcrypt.hashSync(
                      'tutor-password',
                      Number(process.env.SALT)
                    ),
                  },
                },
              },
              update: newTutorPerson,
              where: { email: tutor_email },
            }),
            this.prismaService.student.upsert({
              create: {
                matricule,
                Login: {
                  connect: {
                    person_id_school_id: {
                      school_id,
                      person_id: newStudentPerson.person_id,
                    },
                  },
                },
                Classroom: { connect: { classroom_id } },
                Tutor: {
                  connect: {
                    login_id: tutorPerson.Logins[0].login_id,
                  },
                },
              },
              update: {},
              where: { matricule },
            }),
            this.prismaService.annualStudent.create({
              data: {
                Student: {
                  connect: { matricule },
                },
                AnnualClassroomDivision: {
                  connect: {
                    annual_classroom_division_id,
                  },
                },
                AcademicYear: { connect: { academic_year_id } },
              },
            })
          );
        }
      )
    );
    return this.prismaService.$transaction(queryInstructions);
  }
}
