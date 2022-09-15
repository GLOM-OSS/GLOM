import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { AnnualConfiguratorService } from '../../services/annual-configurator.service';
import { AnnualRegistryService } from '../../services/annual-registry.service';
import { AnnualTeacherService } from '../../services/annual-teacher.service';
import { StudentService } from '../../services/student.service';
import {
  DeserializeSessionData,
  PassportSession,
  RecordValue,
  Role,
  UserRole,
} from '../../utils/types';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(
    private studentService: StudentService,
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
      roles: user['roles'] as UserRole[],
    });
  }

  async deserializeUser(
    user: PassportSession,
    done: (err, user: DeserializeSessionData) => void
  ) {
    const { login_id, roles } = user;
    let deserialedUser: DeserializeSessionData = { login_id };
    for (let i = 0; i < roles.length; i++) {
      const { user_id, role } = roles[i];
      switch (role) {
        case Role.CONFIGURATOR: {
          const annualConfigurator =
            await this.AnnualConfiguratorService.findUnique({
              annual_configurator_id: user_id,
            });
          deserialedUser = { ...deserialedUser, annualConfigurator };
          break;
        }
        case Role.REGISTRY: {
          const annualRegistry = await this.annualRegistryService.findUnique({
            annual_registry_id: user_id,
          });
          deserialedUser = { ...deserialedUser, annualRegistry };
          break;
        }
        case Role.STUDENT: {
          deserialedUser = await this.studentService.findUnique({
            student_id: user_id,
          });
          break;
        }
        case Role.TEACHER: {
          const annualTeacher = await this.annualTeacherService.findUnique({
            annual_teacher_id: user_id,
          });
          deserialedUser = { ...deserialedUser, annualTeacher };
          break;
        }
      }
    }
    done(null, deserialedUser);
  }
}
