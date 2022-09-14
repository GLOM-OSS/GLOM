import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AnnualConfiguratorService } from '../services/annual-configurator.service';
import { AnnualStudentService } from '../services/annual-student.service';
import { LoginService } from '../services/login.service';
import { PersonService } from '../services/person.service';

@Injectable()
export class AppService {
  constructor(
    private loginService: LoginService,
    private personService: PersonService,
    private readonly annualStudentService: AnnualStudentService,
    private readonly annualConfiguratorService: AnnualConfiguratorService
  ) {}
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async insertTestingData() {
    const count = await this.personService.count({});
    if (count === 0) {
      //seed personnel
      const { person_id } = await this.personService.create({
        email: 'personnelmarco@gmail.com',
        birthdate: new Date('03/09/2001'),
        fisrt_name: 'Personnel',
        last_name: 'Marco',
        gender: 'Male',
        national_id_number: '1102645613',
        phone_number: '6730564895',
      });
      await this.annualConfiguratorService.create({
        AcademicYear: {
          create: {
            code: 'Year-202120220001',
            starts_at: new Date(),
            ends_at: new Date(),
          },
        },
        Login: {
          create: {
            password: bcrypt.hashSync('123456789', Number(process.env.SALT)),
            is_personnel: true,
            School: {
              create: {
                email: 'contact@iaicameroun.com',
                phone_number: '67584986532',
                school_name: 'IAI-CAMEROUN',
                subdomain: 'iai.squoolr.com',
                Person: {
                  connect: { person_id },
                },
              },
            },
            Person: {
              connect: { person_id },
            },
          },
        },
      });

      //seed admin
      await this.loginService.create({
        password: bcrypt.hashSync('123456789', Number(process.env.SALT)),
        Person: {
          create: {
            email: 'adminmarco@gmail.com',
            birthdate: new Date('03/09/2001'),
            fisrt_name: 'Admin',
            last_name: 'Marco',
            gender: 'Male',
            national_id_number: '1102645613',
            phone_number: '6730564895',
          },
        },
      });

      //seed student
      await this.annualStudentService.create({
        Student: {
          create: {
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
                    fisrt_name: 'Etudiant',
                    last_name: 'Marco',
                    gender: 'Male',
                    national_id_number: '1102645613',
                    phone_number: '6730564895',
                  },
                },
                School: { connect: { email: 'contact@iaicameroun.com' } },
              },
            },
            classroom_id: randomUUID(),
            matricule: randomUUID(),
          },
        },
        AcademicYear: { connect: { code: 'Year-202120220001' } },
      });
    }
  }
}
