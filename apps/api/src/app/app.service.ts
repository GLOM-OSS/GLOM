import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  //seed personnel
  async seedPersonnel() {
    const { person_id } = await this.prismaService.person.create({
      data: {
        email: 'personnelmarco@gmail.com',
        birthdate: new Date('03/09/2001'),
        first_name: 'Personnel',
        last_name: 'Marco',
        gender: 'Male',
        national_id_number: '1102645613',
        phone_number: '6730564895',
      },
    });
    const { login_id } = await this.prismaService.login.create({
      data: {
        Person: {
          connect: { person_id },
        },
        password: bcrypt.hashSync('123456789', Number(process.env.SALT)),
        is_personnel: true,
        School: {
          create: {
            school_acronym: 'AICS',
            school_code: 'generateUniqueCode()',
            email: 'contact@iaicameroun.com',
            phone_number: '67584986532',
            school_name: 'IAI-CAMEROUN',
            subdomain: 'iai.squoolr.com',
            Person: {
              connect: { person_id },
            },
          },
        },
      },
    });
    const { annual_configurator_id } =
      await this.prismaService.annualConfigurator.create({
        data: {
          AcademicYear: {
            create: {
              year_code: 'Year-202120220001',
              starts_at: new Date(),
              ends_at: new Date(),
              School: { connect: { email: 'contact@iaicameroun.com' } },
            },
          },
          Login: {
            connect: { login_id },
          },
        },
      });

    await this.prismaService.annualConfigurator.create({
      data: {
        Login: { connect: { login_id } },
        AcademicYear: {
          create: {
            year_code: 'Year-202120220002',
            starts_at: new Date(),
            ends_at: new Date(),
            AnnualConfigurator: {
              connect: { annual_configurator_id },
            },
            School: { connect: { email: 'contact@iaicameroun.com' } },
          },
        },
      },
    });
  }

  //seed student
  async seedStudent(annual_configurator_id: string) {
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
                    Department: {
                      create: {
                        department_code: 'YEAR-INF#1L202120220001',
                        department_name: 'Informatique',
                        department_acronym: 'INF',
                        School: {
                          connect: { email: 'contact@iaicameroun.com' },
                        },
                        AnnualConfigurator: {
                          connect: { annual_configurator_id },
                        },
                      },
                    },
                    AnnualConfigurator: {
                      connect: { annual_configurator_id },
                    },
                    Cycle: {
                      create: {
                        cycle_name: 'Licence',
                        cycle_type: 'LONG',
                        number_of_years: 3,
                      },
                    },
                  },
                },
                Level: {
                  create: {
                    level: 3,
                  },
                },
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
                School: { connect: { email: 'contact@iaicameroun.com' } },
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
  async seedAdmin() {
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
  async insertTestingData() {
    const count = await this.prismaService.person.count({});
    if (count === 0) {
      this.seedAdmin();
    }
  }
}
