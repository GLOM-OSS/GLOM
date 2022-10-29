import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH404, ERR03 } from 'apps/api/src/errors';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { CodeGeneratorService } from 'apps/api/src/utils/code-generator';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TeacherPostDto, TeacherPutDto } from '../../configurator.dto';

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
      phone,
      first_name,
      birthdate,
      email,
      gender,
      last_name,
      national_id_number,
      teacher_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payer_card,
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
      where: { phone_number: phone },
    });
    if (person?.phone_number)
      throw new HttpException(
        JSON.stringify(ERR03('phone')),
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
    const private_code = bcrypt.hashSync(
      this.codeGenerator.getNumberString(Math.floor(Math.random() * 10000)),
      Number(process.env.SALT)
    );
    await this.annualTeacherService.create({
      data: {
        hourly_rate,
        origin_institute,
        has_signed_convention,
        TeacherGrade: { connect: { teacher_grade_id } },
        Teacher: {
          create: {
            private_code,
            tax_payer_card_number,
            has_tax_payer_card,
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
              School: { connect: { school_id } },
              Person: {
                connectOrCreate: {
                  create: {
                    email,
                    gender,
                    last_name,
                    birthdate,
                    first_name,
                    national_id_number,
                    phone_number: phone,
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
      phone,
      first_name,
      birthdate,
      email,
      gender,
      last_name,
      national_id_number,
      teacher_grade_id,
      teacher_type_id,
      tax_payer_card_number,
      has_tax_payer_card,
      origin_institute,
      has_signed_convention,
      hourly_rate,
    }: TeacherPutDto,
    audited_by: string
  ) {
    const annualTeacherData = await this.annualTeacherService.findUnique({
      where: { annual_teacher_id },
      select: {
        hourly_rate: true,
        origin_institute: true,
        has_signed_convention: true,
        Teacher: true,
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
      Teacher: { teacher_id, ...teacher },
      ...annualTeacher
    } = annualTeacherData;

    await this.annualTeacherService.update({
      data: {
        has_signed_convention,
        origin_institute,
        hourly_rate,
        TeacherGrade: { update: { teacher_grade_id } },
        AnnualTeacherAudits: {
          create: {
            ...annualTeacher,
            audited_by,
          },
        },
        Teacher: {
          update: {
            tax_payer_card_number,
            has_tax_payer_card,
            teacher_type_id,
            TeacherAudits: {
              create: {
                ...teacher,
                audited_by,
              },
            },
          },
        },
        Login: {
          update: {
            Person: {
              update: {
                first_name,
                birthdate,
                email,
                gender,
                last_name,
                national_id_number,
                phone_number: phone,
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
      },
      where: {
        annual_teacher_id,
      },
    });
  }
}
