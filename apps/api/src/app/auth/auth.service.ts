import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AcademicYear, AcademicYearStatus, Login } from '@prisma/client';
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
import { PassportSession, ActiveYear } from '../../utils/types';

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

  async validateUser(origin: string, email: string, password: string) {
    const person = await this.personService.findUnique({ email });
    const userLogins = (await this.loginService.findAll({
      where: { person_id: person?.person_id },
    })) as Login[];
    for (let i = 0; i < userLogins.length; i++) {
      const login = userLogins[i];
      if (bcrypt.compareSync(password, login?.password)) {
        const user = await this.validateLogin(origin, login);
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

  async validateLogin(origin: string, login: Omit<Login, 'password'>) {
    const { login_id, school_id, cookie_age } = login;
    const user: Omit<PassportSession, 'log_id'> = { login_id, cookie_age, roles: [] };
    const activeLogs = await this.logService.count({
      login_id,
      OR: {
        logged_out_at: { not: { lte: new Date() } },
        closed_at: { not: { lte: new Date() } },
      },
    });
    if (activeLogs === 3) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH02['Fr'],
      });
    }

    if (school_id) {
      const school = await this.schoolService.findOne({
        school_id,
      });
      if (origin === school?.subdomain) {
        const student = await this.studentService.findOne({
          login_id,
        });
        if (!student)
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized access',
            message: AUTH401['Fr'],
          }); //someone attempting to be a student
      } else if (!login.is_personnel || origin !== `admin.${school.subdomain}`)
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized access',
          message: AUTH401['Fr'],
        }); //someone attempting to be a personnel
    } else if (origin !== process.env.SQUOOLR_URL)
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
        message: AUTH401['Fr'],
      }); //attempting to be an admin
    return user;
  }

  async getAcademicYears(login_id: string) {
    const select = {
      AcademicYear: {
        select: {
          code: true,
          started_at: true,
          ended_at: true,
          status: true,
          starts_at: true,
          ends_at: true,
          academic_year_id: true,
        },
      },
    };
    //check for annual student
    const annualStudents = (await this.annualStudentService.findAll({
      select,
      where: { Student: { login_id }, is_deleted: false },
    })) as AcademicYearObject[];
    if (annualStudents.length > 0) {
      return annualStudents.map(
        ({ AcademicYear: academicYear }) => academicYear
      );
    }

    //check for annual configurator
    const annualConfigurators = (await this.AnnualConfiguratorService.findAll({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualRegistries = (await this.annualRegistryService.findAll({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    //check for annual registry
    const annualTeachers = (await this.annualTeacherService.findAll({
      select,
      where: { login_id, is_deleted: false },
    })) as AcademicYearObject[];

    const academic_years: ActiveYear[] = [];

    [...annualConfigurators, ...annualRegistries, ...annualTeachers].forEach(
      ({
        AcademicYear: {
          academic_year_id,
          code,
          ended_at,
          ends_at,
          started_at,
          starts_at,
          status,
        },
      }) => {
        if (
          !academic_years.find((_) => _.academic_year_id === academic_year_id)
        ) {
          academic_years.push({
            code,
            status,
            academic_year_id,
            starting_date:
              status !== AcademicYearStatus.INACTIVE ? started_at : starts_at,
            ending_date:
              status !== AcademicYearStatus.FIINISHED ? ends_at : ended_at,
          });
        }
      }
    );

    return academic_years;
  }
}
