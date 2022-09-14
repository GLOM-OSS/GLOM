import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AcademicYear, Login } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AUTH02, AUTH401 } from '../../errors';
import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { LogService } from '../../services/log.service';
import { LoginService } from '../../services/login.service';
import { PersonService } from '../../services/person.service';
import { SchoolService } from '../../services/school.service';
import { StudentService } from '../../services/student.service';
import { SerializeSessionData } from '../../utils/types';

type AcademicYearObject = { AcademicYear: AcademicYear };

@Injectable()
export class AuthService {
  constructor(
    private logService: LogService,
    private personService: PersonService,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private annualStudentService: AnnualStudentService,
    private annualTeacherService: AnnualTeacherService,
    private annualRegistryService: AnnualRegistryService,
    private AnnualConfiguratorService: AnnualConfiguratorService
  ) {}

  async validateUser(host: string, email: string, password: string) {
    const person = await this.personService.findUnique({ email });
    const userLogins = (await this.loginService.findAll({
      where: { person_id: person?.person_id },
    })) as Login[];
    for (let i = 0; i < userLogins.length; i++) {
      const login = userLogins[i];
      if (bcrypt.compareSync(password, login?.password)) {
        const user = await this.validateLogin(host, login);
        return {
          ...user,
          ...person,
          login_id: login.login_id,
        };
      }
    }
    throw new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized access',
      message: AUTH401['Fr'],
    });
  }

  async validateLogin(host: string, login: Omit<Login, 'password'>) {
    const { login_id, school_id } = login;
    const user: SerializeSessionData = { login_id, roles: [] };
    const activeLogs = await this.logService.count({
      login_id,
      NOT: {
        logged_out_at: { lte: new Date() },
        closed_at: { lte: new Date() },
      },
    });
    if (activeLogs === 3) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH02['Fr'],
      });
    }

    if (!school_id && host !== process.env.SQUOOLR_URL)
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH401['Fr'],
      });
    //attrmting to be an admin
    else {
      const school = await this.schoolService.findOne({
        school_id,
      });
      if (host === school?.subdomain) {
        const student = await this.studentService.findOne({
          login_id,
        });
        if (!student)
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized access',
            message: AUTH401['Fr'],
          }); //someone attempting to be a student
      } else if (!login.is_personnel)
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['Fr'],
        }); //someone attempting to be a personnel
    }
    return user;
  }

  async getAcademicYears(login_id: string) {
    const select = {
      academic_year_id: true,
      AcademicYear: {
        select: {
          code: true,
          started_at: true,
          ended_at: true,
          status: true,
          starts_at: true,
          ends_at: true,
        },
      },
    };
    //check for annual student
    const annualStudents = (await this.annualStudentService.findAll({
      select,
      where: { Student: { login_id } },
    })) as AcademicYearObject[];
    if (annualStudents.length > 0) {
      return annualStudents.map(
        ({ AcademicYear: academicYear }) => academicYear
      );
    }

    //check for annual configurator
    const annualConfigurators = (await this.AnnualConfiguratorService.findAll({
      select,
      where: { login_id },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualRegistries = (await this.annualRegistryService.findAll({
      select,
      where: { login_id },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualTeachers = (await this.annualTeacherService.findAll({
      select,
      where: { login_id },
    })) as AcademicYearObject[];

    const academic_years: AcademicYear[] = [];

    [...annualConfigurators, ...annualRegistries, ...annualTeachers].forEach(
      ({ AcademicYear: academicYear }) => {
        if (
          !academic_years.find(
            (_) => _.academic_year_id === academicYear.academic_year_id
          )
        ) {
          academic_years.push(academicYear);
        }
      }
    );

    return academic_years;
  }
}
