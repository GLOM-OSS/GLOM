import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Role } from '../../app/auth/auth.decorator';
import { QueryParamsDto } from '../modules.dto';
import { ConfiguratorsService } from './configurators/configurators.service';
import { CoordinatorsService } from './coordinators/coordinators.service';
import { RegistriesService } from './registries/registries.service';
import { IStaffService } from './staff';
import { StaffEntity } from './staff.dto';
import { TeachersService } from './teachers/teachers.service';

export type StaffRole = Extract<
  Role,
  Role.CONFIGURATOR | Role.REGISTRY | Role.TEACHER | Role.COORDINATOR
>;
export const getStaffWhereInput = (
  academic_year_id: string,
  params?: QueryParamsDto
) => ({
  academic_year_id,
  is_deleted: params?.is_deleted,
  ...Prisma.validator<Prisma.LoginWhereInput>()({
    Person: {
      OR: {
        email: {
          search: params?.keywords,
        },
        last_name: {
          search: params?.keywords,
        },
        first_name: {
          search: params?.keywords,
        },
      },
    },
  }),
});
export const getStaffSelect = (
  academic_year_id: string,
  activeRole: StaffRole,
  params?: QueryParamsDto
) => ({
  is_deleted: true,
  Login: Prisma.validator<Prisma.LoginFindManyArgs>()({
    select: {
      login_id: true,
      AnnualConfigurators:
        activeRole === Role.CONFIGURATOR
          ? {
              select: { matricule: true, annual_configurator_id: true },
              where: getStaffWhereInput(academic_year_id, params),
            }
          : undefined,
      AnnualRegistries:
        activeRole === Role.REGISTRY
          ? {
              select: { matricule: true, annual_registry_id: true },
              where: getStaffWhereInput(academic_year_id, params),
            }
          : undefined,
      AnnualTeachers:
        activeRole === Role.TEACHER
          ? {
              select: {
                annual_teacher_id: true,
                AnnualClassroomDivisions: {
                  select: { annual_coordinator_id: true },
                },
              },
              where: getStaffWhereInput(academic_year_id, params),
            }
          : undefined,
      Person: {
        select: {
          national_id_number: true,
          phone_number: true,
          first_name: true,
          last_name: true,
          birthdate: true,
          address: true,
          gender: true,
          email: true,
        },
      },
      Logs: {
        take: 1,
        orderBy: {
          logged_in_at: 'desc',
        },
        select: { logged_in_at: true },
      },
    },
  }),
});

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
    const staffServices: Record<StaffRole, IStaffService<StaffEntity>> = {
      CONFIGURATOR: this.configuratorsService,
      REGISTRY: this.registriesService,
      TEACHER: this.teachersService,
      COORDINATOR: this.coordinatorsService,
    };
    if (role === 'ALL') {
      const staff = await Promise.all(
        Object.keys(staffServices).map((key) =>
          staffServices[key as StaffRole].findAll(academic_year_id, params)
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
    return staffServices[role as StaffRole].findAll(academic_year_id, params);
  }
}
