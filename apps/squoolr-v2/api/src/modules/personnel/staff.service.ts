import { Injectable } from '@nestjs/common';
import { StaffRole } from '../../utils/enums';
import { QueryParamsDto } from '../modules.dto';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { IStaffService } from './staff';
import { StaffEntity } from './staff.dto';
import { TeachersService } from './teachers/teachers.service';

@Injectable()
export class StaffService {
  private staffServices: Record<StaffRole, IStaffService<StaffEntity>>;
  constructor(
    private teachersService: TeachersService,
    private registriesService: RegistriesService,
    private coordinatorsService: CoordinatorsService,
    private configuratorsService: ConfiguratorsService
  ) {
    this.staffServices = {
      CONFIGURATOR: this.configuratorsService,
      REGISTRY: this.registriesService,
      TEACHER: this.teachersService,
      COORDINATOR: this.coordinatorsService,
    };
  }

  async findAll(
    role: StaffRole | 'ALL',
    academic_year_id: string,
    params?: QueryParamsDto
  ) {
    if (role === 'ALL') {
      const staff = await Promise.all(
        Object.keys(this.staffServices).map((key) =>
          this.staffServices[key].findAll(academic_year_id, params)
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
    return this.staffServices[role].findAll(academic_year_id, params);
  }

  async findOne(role: StaffRole, annual_personnel_id: string) {
    return this.staffServices[
      role === StaffRole.COORDINATOR ? StaffRole.TEACHER : role
    ].findOne(annual_personnel_id);
  }
}
