import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { LogService } from '../../services/log.service';
import { LoginService } from '../../services/login.service';
import { PersonService } from '../../services/person.service';
import { SchoolService } from '../../services/school.service';
import { StudentService } from '../../services/student.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [],
  providers: [
    PrismaService,

    AuthService,
    LocalStrategy,
    AuthSerializer,

    LogService,
    LoginService,
    PersonService,
    SchoolService,
    StudentService,
    AnnualTeacherService,
    AnnualStudentService,
    AnnualRegistryService,
    AnnualConfiguratorService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
