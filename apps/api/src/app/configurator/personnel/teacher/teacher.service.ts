import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404, ERR03 } from '../../../../errors';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../../utils/code-generator';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TeacherPostDto, TeacherPutDto } from '../../configurator.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeacherService {
  private loginService: typeof this.prismaService.login;
  private personService: typeof this.prismaService.person;
  private annualTeacherService: typeof this.prismaService.annualTeacher;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.loginService = prismaService.login;
    this.personService = prismaService.person;
    this.annualTeacherService = prismaService.annualTeacher;
  }

  async addNewTeacher(
    {
      phone_number,
      first_name,
      birthdate,
      email,
      gender,
      last_name,
      address,
      national_id_number,
      teaching_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payers_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
    }: TeacherPostDto,
    {
      academic_year_id,
      school_id,
    }: { academic_year_id: string; school_id: string },
    added_by: string
  ) {
    const person = await this.personService.findUnique({
      where: { phone_number },
    });
    if (person?.phone_number)
      throw new HttpException(
        JSON.stringify(ERR03('phone_number')),
        HttpStatus.AMBIGUOUS
      );

    const login = await this.loginService.findFirst({
      where: {
        school_id,
        Person: { email },
      },
    });
    if (login?.login_id) {
      const staff = await this.annualTeacherService.findUnique({
        where: {
          login_id_academic_year_id: {
            academic_year_id,
            login_id: login.login_id,
          },
        },
      });
      if (staff)
        throw new HttpException(
          JSON.stringify(ERR03('teacher')),
          HttpStatus.AMBIGUOUS
        );
    }

    const login_id = login?.login_id ?? randomUUID();
    const password = Math.random().toString(36).slice(2).toUpperCase();
    const matricule = await this.codeGenerator.getTeacherCode(school_id);
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    //TODO NodeMailer send generated password and private code
    await this.annualTeacherService.create({
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeachingGrade: { connect: { teaching_grade_id } },
        Teacher: {
          create: {
            matricule,
            private_code,
            tax_payer_card_number,
            has_tax_payers_card,
            TeacherType: { connect: { teacher_type_id } },
          },
        },
        AcademicYear: { connect: { academic_year_id } },
        AnnualConfigurator: { connect: { annual_configurator_id: added_by } },
        Login: {
          connectOrCreate: {
            create: {
              login_id,
              password,
              is_personnel: true,
              School: { connect: { school_id } },
              Person: {
                connectOrCreate: {
                  create: {
                    email,
                    gender,
                    address,
                    last_name,
                    birthdate,
                    first_name,
                    national_id_number,
                    phone_number,
                  },
                  where: { email },
                },
              },
            },
            where: { login_id },
          },
        },
      },
    });
  }

  async editTeacher(
    annual_teacher_id: string,
    {
      teaching_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payers_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
      ...newPerson
    }: TeacherPutDto,
    audited_by: string
  ) {
    const annualTeacherData = await this.annualTeacherService.findUnique({
      where: { annual_teacher_id },
      select: {
        hourly_rate: true,
        origin_institute: true,
        has_signed_convention: true,
        Teacher: {
          select: {
            private_code: true,
            tax_payer_card_number: true,
            has_tax_payers_card: true,
            teacher_type_id: true,
          },
        },
        Login: {
          select: {
            Person: true,
          },
        },
      },
    });
    if (!annualTeacherData)
      throw new HttpException(
        JSON.stringify(AUTH404('Personnel')),
        HttpStatus.NOT_FOUND
      );
    const {
      Login: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Person: { created_at, person_id, ...person },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Teacher: teacher,
      ...annualTeacher
    } = annualTeacherData;
    let updateData: Prisma.AnnualTeacherUpdateInput = {
      TeachingGrade: { update: { teaching_grade_id } },
    };

    const newAnnualTeacher = {
      has_signed_convention,
      origin_institute,
      hourly_rate,
    };
    const annualTeacherDataHasChanged = Object.keys(newAnnualTeacher)
      .map((key) => newAnnualTeacher[key] === annualTeacher[key])
      .includes(false);
    if (annualTeacherDataHasChanged)
      updateData = {
        ...newAnnualTeacher,
        AnnualTeacherAudits: {
          create: {
            ...annualTeacher,
            audited_by,
          },
        },
      };

    const newTeacher = {
      tax_payer_card_number,
      has_tax_payers_card,
      teacher_type_id,
    };
    const teacherDataHasChanged = Object.keys(newTeacher)
      .map((key) => newTeacher[key] === teacher[key])
      .includes(false);
    if (teacherDataHasChanged)
      updateData = {
        ...updateData,
        Teacher: {
          update: {
            ...newTeacher,
            TeacherAudits: {
              create: {
                ...teacher,
                audited_by,
              },
            },
          },
        },
      };

    const personDataHasChanged = Object.keys(newPerson)
      .map((key) => newPerson[key] === person[key])
      .includes(false);
    if (personDataHasChanged)
      updateData = {
        ...updateData,
        Login: {
          update: {
            Person: {
              update: {
                ...newPerson,
                PersonAudits: {
                  create: {
                    ...person,
                    AnnualConfigurator: {
                      connect: { annual_configurator_id: audited_by },
                    },
                  },
                },
              },
            },
          },
        },
      };

    await this.annualTeacherService.update({
      data: updateData,
      where: {
        annual_teacher_id,
      },
    });
  }
}
