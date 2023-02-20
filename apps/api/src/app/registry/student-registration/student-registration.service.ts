import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnnualStudent, Person, PrismaPromise, Student } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH404 } from '../../../../src/errors';
import { PrismaService } from '../../../prisma/prisma.service';

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

  async registerImportedStudents({
    academic_year_id,
    importedStudentData,
    major_id,
    school_id,
    level = 1,
  }: {
    level?: number;
    major_id: string;
    school_id: string;
    academic_year_id: string;
    importedStudentData: StudentImportInterface[];
  }) {
    const classroomDivision =
      await this.prismaService.annualClassroomDivision.findFirst({
        select: {
          annual_classroom_division_id: true,
          AnnualClassroom: { select: { classroom_id: true } },
        },
        where: { AnnualClassroom: { Classroom: { major_id, level } } },
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
    const annualCreditUnit = await this.prismaService.annualCreditUnit.findMany(
      {
        where: {
          major_id,
          academic_year_id,
          is_deleted: false,
          is_exam_published: false,
          semester_number: { lte: level * 2 },
        },
      }
    );
    const existingAccounts = await this.prismaService.person.findMany({
      select: {
        email: true,
        person_id: true,
        Logins: {
          select: { login_id: true, school_id: true, is_parent: true },
        },
      },
      where: {
        OR: importedStudentData.reduce<{ email: string }[]>(
          (emails, { email, tutor_email }) => [
            ...emails,
            { email },
            { email: tutor_email },
          ],
          []
        ),
      },
    });
    const queryInstructions = importedStudentData.reduce<
      PrismaPromise<Person | Student | AnnualStudent>[]
    >(
      (
        queries,
        {
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
        }
      ) => {
        const studentPerson = existingAccounts.find(
          ({ email }) => email === person.email
        );
        const tutorPerson = existingAccounts.find(
          ({ email }) => email === tutor_email
        );
        const newStudentPerson = {
          ...person,
          birthdate: new Date(birthdate),
          phone_number: phone_number.toString(),
          national_id_number: national_id_number.toString(),
          person_id: studentPerson?.person_id ?? randomUUID(),
        };
        const logins = tutorPerson?.Logins;
        const tutorLoginId =
          logins && logins.length > 0 && logins[0].is_parent
            ? logins[0].login_id
            : randomUUID();
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
          Logins: {
            connectOrCreate: {
              create: {
                is_parent: true,
                login_id: tutorLoginId,
                password: bcrypt.hashSync(
                  'tutor-password',
                  Number(process.env.SALT)
                ),
              },
              where: { login_id: tutorLoginId },
            },
          },
        };

        return [
          ...queries,
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
            create: newTutorPerson,
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
                  login_id: tutorLoginId,
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
              AnnualStudentHasCreditUnits: {
                create: annualCreditUnit.map(
                  ({ annual_credit_unit_id, semester_number }) => ({
                    semester_number,
                    annual_credit_unit_id,
                  })
                ),
              },
            },
          }),
        ];
      },
      []
    );
    return this.prismaService.$transaction(queryInstructions);
  }
}
