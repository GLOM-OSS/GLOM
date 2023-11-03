import { Injectable } from '@nestjs/common';
import { Role } from '../../app/auth/auth.decorator';
import { QueryParamsDto } from '../modules.dto';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { IStaffService } from './staff';
import { StaffEntity } from './staff.dto';
import { TeachersService } from './teachers/teachers.service';

@Injectable()
export class StaffService {
  constructor(
    private teachersService: TeachersService,
    private registriesService: RegistriesService,
    private coordinatorsService: CoordinatorsService,
    private configuratorsService: ConfiguratorsService
  ) {}

  async findAll(
    role: Role | 'ALL',
    academic_year_id: string,
    params?: QueryParamsDto
  ) {
    const staffServices: Record<string, IStaffService<StaffEntity>> = {
      CONFIGURATOR: this.configuratorsService,
      REGISTRY: this.registriesService,
      TEACHER: this.teachersService,
      COORDINATOR: this.coordinatorsService,
    };
    if (role === 'ALL') {
      const staff = await Promise.all(
        Object.keys(staffServices).map((key) =>
          staffServices[key].findAll(academic_year_id, params)
        )
      );
      return staff.reduce(
        (reducedStaff, staff) => [
          ...reducedStaff,
          ...staff.filter((_) =>
            reducedStaff.find((__) => _.login_id !== __.login_id)
          ),
        ],
        []
      );
    }
    return staffServices[role].findAll(academic_year_id, params);
  }
}
