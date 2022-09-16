import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AcademicYearStatus } from '@prisma/client';
import { AcademicYearService } from '../../services/academic-year.service';

import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualStudentService } from '../../services/annual-student.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { PersonService } from '../../services/person.service';
import {
  DeserializeSessionData,
  PassportSession,
  RecordValue,
  Role,
  UserRole
} from '../../utils/types';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(
    private personService: PersonService,
    private academicYearService: AcademicYearService,
    private annualStudentService: AnnualStudentService,
    private annualTeacherService: AnnualTeacherService,
    private annualRegistryService: AnnualRegistryService,
    private AnnualConfiguratorService: AnnualConfiguratorService
  ) {
    super();
  }

  serializeUser(
    user: Record<string, RecordValue>,
    done: (err, user: PassportSession) => void
  ) {
    done(null, {
      log_id: user['log_id'] as string,
      login_id: user['login_id'] as string,
      academic_year_id: user['academic_year_id'] as string,
      roles: user['roles'] as UserRole[],
    });
  }

  async deserializeUser(
    user: PassportSession,
    done: (err, user: DeserializeSessionData) => void
  ) {
    const { academic_year_id, login_id, roles } = user;
    const person = await this.personService.findOne({
      where: { Logins: { some: { login_id } } },
    });
    if (!academic_year_id) {
      done(null, null);
    }
    const { started_at, ended_at, starts_at, ends_at, code, status } =
      await this.academicYearService.findOne({
        academic_year_id,
        is_deleted: false,
      });

    let deserialedUser: DeserializeSessionData = {
      login_id,
      ...person,
      activeYear: {
        code,
        status,
        academic_year_id,
        starting_date:
          status !== AcademicYearStatus.INACTIVE ? started_at : starts_at,
        ending_date:
          status !== AcademicYearStatus.FIINISHED ? ends_at : ended_at,
      },
    };
    for (let i = 0; i < roles.length; i++) {
      const { user_id, role } = roles[i];
      if (role === Role.STUDENT) {
        deserialedUser = {
          ...deserialedUser,
          annualStudent: await this.annualStudentService.findOne({
            annual_student_id: user_id,
            is_deleted: false,
          }),
        };
        break;
      } else {
        switch (role) {
          case Role.CONFIGURATOR: {
            const { annual_configurator_id, is_sudo } =
              await this.AnnualConfiguratorService.findOne({
                annual_configurator_id: user_id,
                is_deleted: false,
              });
            deserialedUser = {
              ...deserialedUser,
              annualConfigurator: { annual_configurator_id, is_sudo },
            };
            break;
          }
          case Role.REGISTRY: {
            const { annual_registry_id } =
              await this.annualRegistryService.findOne({
                annual_registry_id: user_id,
                is_deleted: false,
              });
            deserialedUser = {
              ...deserialedUser,
              annualRegistry: { annual_registry_id },
            };
            break;
          }
          case Role.TEACHER: {
            const {
              annual_teacher_id,
              has_signed_convention,
              hourly_rate,
              origin_institute,
              teacher_id,
            } = await this.annualTeacherService.findOne({
              annual_teacher_id: user_id,
              is_deleted: false,
            });
            deserialedUser = {
              ...deserialedUser,
              annualTeacher: {
                annual_teacher_id,
                has_signed_convention,
                hourly_rate,
                origin_institute,
                teacher_id,
              },
            };
            break;
          }
        }
      }
    }
    done(null, deserialedUser);
  }
}
