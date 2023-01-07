import { Injectable } from '@nestjs/common';
import { EvaluationTypeEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {
    this.prismaService.person.count().then((count) => {
      if (count === 0) this.seedAdmin();
    });
    this.prismaService.cycle.count().then((numberOfCycles) => {
      if (numberOfCycles === 0) this.seedCycles();
    });
    this.prismaService.teachingGrade.count().then((numberOfTeacherGrades) => {
      if (numberOfTeacherGrades === 0) this.seedTeacherGrades();
    });
    this.prismaService.teacherType.count().then((numberOfTeacherTypes) => {
      if (numberOfTeacherTypes === 0) this.seedTeacherTypes();
    });
    this.prismaService.subjectPart.count().then((numberOfSubjectParts) => {
      if (numberOfSubjectParts === 0) this.seedSubjectParts();
    });
    this.prismaService.grade.count().then((numberOfGrades) => {
      if (numberOfGrades === 0) this.seedGrades();
    });
    this.prismaService.evaluationType.count().then((numberEvaluationTypes) => {
      if (numberEvaluationTypes === 0) this.seedEvaluationTypes();
    });
  }
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  private async seedEvaluationTypes() {
    await this.prismaService.evaluationType.createMany({
      data: [
        { evaluation_type: EvaluationTypeEnum.EXAM },
        { evaluation_type: EvaluationTypeEnum.CA },
      ],
    });
  }

  private async seedGrades() {
    await this.prismaService.grade.createMany({
      data: [
        { grade_value: 'A+' },
        { grade_value: 'A' },
        { grade_value: 'A-' },
        { grade_value: 'B+' },
        { grade_value: 'B' },
        { grade_value: 'B-' },
        { grade_value: 'C+' },
        { grade_value: 'C' },
        { grade_value: 'C-' },
        { grade_value: 'D+' },
        { grade_value: 'D' },
        { grade_value: 'D-' },
        { grade_value: 'F' },
        { grade_value: 'E' },
      ],
    });
  }

  private async seedSubjectParts() {
    await this.prismaService.subjectPart.createMany({
      data: [
        {
          subject_part_id: process.env['NX_THEORY_SUBJECT_PART_ID'] as string,
          subject_part_name: 'THEORY',
        },
        {
          subject_part_id: process.env[
            'NX_PRACTICAL_SUBJECT_PART_ID'
          ] as string,
          subject_part_name: 'PRACTICAL',
        },
        {
          subject_part_id: process.env[
            'NX_GUIDED_WORK_SUBJECT_PART_ID'
          ] as string,
          subject_part_name: 'GUIDED_WORK',
        },
      ],
    });
  }

  //seed student
  private async seedStudent() {
    const numberOfStudents = await this.prismaService.student.count();
    return this.prismaService.annualStudent.create({
      data: {
        AnnualClassroomDivision: {
          connect: {
            annual_classroom_division_id:
              '1db0443d-eddc-40d6-ac19-d205c35a554c',
          },
        },
        EvaluationHasStudents: {
          createMany: {
            data: [
              {
                //CA evaluation type
                evaluation_id: '40d62187-abb1-4cb9-b633-3287a8c1cac6',
                anonymity_code: Math.random()
                  .toString(36)
                  .slice(2)
                  .toUpperCase(),
              },
              {
                //Resit evaluation type
                evaluation_id: '1d429fd1-441b-43d5-a4ff-e2a6c74e3785',
                anonymity_code: Math.random()
                  .toString(36)
                  .slice(2)
                  .toUpperCase(),
              },
              {
                //CA evaluation type
                evaluation_id: 'd3f18067-add9-49ec-ba57-ca97c3d7e583',
                anonymity_code: Math.random()
                  .toString(36)
                  .slice(2)
                  .toUpperCase(),
              },
              {
                //Resit evaluation type
                evaluation_id: '9e929e76-98b5-4e59-b3e9-28c65c4e9df6',
                anonymity_code: Math.random()
                  .toString(36)
                  .slice(2)
                  .toUpperCase(),
              },
            ],
          },
        },
        Student: {
          create: {
            Classroom: {
              connect: { classroom_code: 'GL10001' },
            },
            Login: {
              create: {
                password: bcrypt.hashSync(
                  '987654321',
                  Number(process.env.SALT)
                ),
                Person: {
                  create: {
                    email: `student${numberOfStudents}@gmail.com`,
                    birthdate: new Date('03/09/2001'),
                    first_name: 'Etudiant',
                    last_name: 'Marco',
                    gender: 'Male',
                    national_id_number: '1102645613',
                    phone_number: `6730564${numberOfStudents}95`,
                  },
                },
                School: {
                  connect: { school_code: 'AICS0001' },
                },
              },
            },
            matricule: Math.random().toString(36).slice(2).toUpperCase(),
          },
        },
        AcademicYear: { connect: { year_code: 'YEAR-202320010001' } },
      },
    });
  }

  //seed admin
  private async seedAdmin() {
    await this.prismaService.login.create({
      data: {
        password: bcrypt.hashSync('123456789', Number(process.env.SALT)),
        Person: {
          create: {
            email: 'adminmarco@gmail.com',
            birthdate: new Date('03/09/2001'),
            first_name: 'Admin',
            last_name: 'Marco',
            gender: 'Male',
            national_id_number: '1102645613',
            phone_number: '6730564895',
          },
        },
      },
    });
  }
  //seed cycles
  private async seedCycles() {
    await this.prismaService.cycle.createMany({
      data: [
        { cycle_name: 'BACHELOR', cycle_type: 'LONG', number_of_years: 3 },
        { cycle_name: 'BTS', cycle_type: 'LONG', number_of_years: 2 },
        { cycle_name: 'DTS', cycle_type: 'LONG', number_of_years: 2 },
        { cycle_name: 'DUT', cycle_type: 'LONG', number_of_years: 2 },
        { cycle_name: 'MASTER', cycle_type: 'SHORT', number_of_years: 2 },
        { cycle_name: 'MASTER', cycle_type: 'LONG', number_of_years: 5 },
        { cycle_name: 'DOCTORAT', cycle_type: 'LONG', number_of_years: 7 },
        { cycle_name: 'DOCTORAT', cycle_type: 'SHORT', number_of_years: 2 },
      ],
    });
  }

  private async seedTeacherGrades() {
    await this.prismaService.teachingGrade.createMany({
      data: [
        { teaching_grade: 'CLASS_C' },
        { teaching_grade: 'CLASS_D' },
        { teaching_grade: 'LECTURER' },
        { teaching_grade: 'COURSE_INSTRUTOR' },
        { teaching_grade: 'ASSISTANT' },
      ],
    });
  }

  private async seedTeacherTypes() {
    // vacataire, permanent, missionnaire
    await this.prismaService.teacherType.createMany({
      data: [
        { teacher_type: 'PART_TIME' },
        { teacher_type: 'PERMAMENT' },
        { teacher_type: 'MISSIONARY' },
      ],
    });
  }

  getCycles() {
    return this.prismaService.cycle.findMany();
  }
  getTeacherGrades() {
    return this.prismaService.teachingGrade.findMany();
  }
  getTeacherTypes() {
    return this.prismaService.teacherType.findMany();
  }
  getEvaluationTypes() {
    return this.prismaService.teachingGrade.findMany();
  }
  getSubjectParts() {
    return this.prismaService.subjectPart.findMany();
  }
  getGrades() {
    return this.prismaService.grade.findMany();
  }
}
