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

  // async findOne(role: Role, annual_personnel_id: string) {
  //   const select = {
  //     Login: {
  //       select: {
  //         login_id: true,
  //         Person: {
  //           select: {
  //             first_name: true,
  //             last_name: true,
  //             email: true,
  //             phone_number: true,
  //             national_id_number: true,
  //             gender: true,
  //             address: true,
  //             birthdate: true,
  //           },
  //         },
  //       },
  //     },
  //   };
  //   switch (role) {
  //     case Role.REGISTRY: {
  //       const {
  //         annual_registry_id,
  //         matricule,
  //         Login: { login_id, Person: person },
  //       } = await this.prismaService.annualRegistry.findFirst({
  //         select: {
  //           ...select,
  //           matricule: true,
  //           annual_registry_id: true,
  //         },
  //         where: { annual_registry_id: annual_personnel_id, is_deleted: false },
  //       });
  //       return {
  //         login_id,
  //         ...person,
  //         matricule,
  //         annual_registry_id,
  //       };
  //     }
  //     case Role.TEACHER: {
  //       const {
  //         Teacher: { matricule, ...teacher },
  //         annual_teacher_id,
  //         Login: { login_id, Person: person },
  //         ...annual_teacher
  //       } = await this.prismaService.annualTeacher.findFirst({
  //         select: {
  //           ...select,
  //           has_signed_convention: true,
  //           origin_institute: true,
  //           teaching_grade_id: true,
  //           hourly_rate: true,
  //           Teacher: {
  //             select: {
  //               matricule: true,
  //               has_tax_payers_card: true,
  //               tax_payer_card_number: true,
  //               teacher_type_id: true,
  //             },
  //           },
  //           annual_teacher_id: true,
  //         },
  //         where: { annual_teacher_id: annual_personnel_id, is_deleted: false },
  //       });

  //       return {
  //         personnel_id: annual_teacher_id,
  //         personnel_code: matricule,
  //         ...annual_teacher,
  //         ...teacher,
  //         ...person,
  //         login_id,
  //       };
  //     }
  //     case Role.CONFIGURATOR: {
  //       const {
  //         annual_configurator_id,
  //         matricule,
  //         Login: { login_id, Person: person },
  //       } = await this.prismaService.annualConfigurator.findFirst({
  //         select: {
  //           ...select,
  //           matricule: true,
  //           annual_configurator_id: true,
  //         },
  //         where: {
  //           annual_configurator_id: annual_personnel_id,
  //           is_deleted: false,
  //         },
  //       });
  //       return {
  //         personnel_id: annual_configurator_id,
  //         personnel_code: matricule,
  //         login_id,
  //         ...person,
  //       };
  //     }
  //     default:
  //       throw new NotImplementedException(`${role} role not supported !!!`);
  //   }
  // }

}
