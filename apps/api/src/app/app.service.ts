import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {
    this.prismaService.person.count().then((count) => {
      if (count === 0) this.seedAdmin();
    });
    this.prismaService.cycle.count().then((cyleCount) => {
      if (cyleCount === 0) this.seedCycles();
    });
    this.prismaService.teachingGrade.count().then((teacherGradeCount) => {
      if (teacherGradeCount === 0) this.seedTeacherGrades();
    });
    this.prismaService.teacherType.count().then((teacherTypeCount) => {
      if (teacherTypeCount === 0) this.seedTeacherTypes();
    });
    this.prismaService.subjectPart.count().then((subjectParts) => {
      if (subjectParts === 0) this.seedSubjectParts();
    });
  }
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
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
          subject_part_name: 'GUIDED_WOR',
        },
      ],
    });
  }

  //seed student
  private async seedStudent(annual_configurator_id: string) {
    await this.prismaService.annualStudent.create({
      data: {
        Student: {
          create: {
            Classroom: {
              create: {
                classroom_code: 'YEAR-INF1#GL#1202120220001',
                classroom_name: 'Genie Logiciel 3C',
                classroom_acronym: 'GL3C',
                Major: {
                  create: {
                    major_code: 'YEAR-INF1#GL202120220001',
                    major_name: 'Genie Logiciel',
                    major_acronym: 'GL',
                    AnnualConfigurator: {
                      connect: { annual_configurator_id },
                    },
                    Cycle: {
                      create: {
                        cycle_name: 'BACHELOR',
                        cycle_type: 'LONG',
                        number_of_years: 3,
                      },
                    },
                  },
                },
                level: 3,
                AnnualConfigurator: {
                  connect: {
                    annual_configurator_id,
                  },
                },
              },
            },
            Login: {
              create: {
                password: bcrypt.hashSync(
                  '123456789',
                  Number(process.env.SALT)
                ),
                Person: {
                  create: {
                    email: 'etudiantmarco@gmail.com',
                    birthdate: new Date('03/09/2001'),
                    first_name: 'Etudiant',
                    last_name: 'Marco',
                    gender: 'Male',
                    national_id_number: '1102645613',
                    phone_number: '6730564895',
                  },
                },
                School: {
                  connect: { school_email: 'contact@iaicameroun.com' },
                },
              },
            },
            matricule: randomUUID(),
          },
        },
        AcademicYear: { connect: { year_code: 'Year-202120220001' } },
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
}
