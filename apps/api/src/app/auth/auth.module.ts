import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { LogService } from '../../services/log.service';
import { LoginService } from '../../services/login.service';
import { PersonService } from '../../services/person.service';
import { ResetPasswordService } from '../../services/reset-password.service';
import { SchoolService } from '../../services/school.service';
import { StudentService } from '../../services/student.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [],
  providers: [
    PrismaService,

    AuthService,
    LocalStrategy,
    GoogleStrategy,
    AuthSerializer,

    LogService,
    LoginService,
    PersonService,
    SchoolService,
    StudentService,
    AcademicYearService,
    AnnualTeacherService,
    AnnualStudentService,
    ResetPasswordService,
    AnnualRegistryService,
    AnnualConfiguratorService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
