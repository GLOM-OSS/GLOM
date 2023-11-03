import { Prisma } from '@prisma/client';
import { Role } from '../../utils/enums';
import { QueryParams } from '../module';
import { StaffSelectParams } from './staff';

export class StaffArgsFactory {
  static getStaffWhereInput = (
    academic_year_id: string,
    params?: QueryParams
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

  static getStaffSelect = (staffParams?: StaffSelectParams) => ({
    is_deleted: true,
    Login: Prisma.validator<Prisma.LoginFindManyArgs>()({
      select: {
        login_id: true,
        AnnualConfigurators:
          staffParams?.activeRole === Role.CONFIGURATOR
            ? {
                select: { matricule: true, annual_configurator_id: true },
                where: this.getStaffWhereInput(
                  staffParams?.academic_year_id,
                  staffParams?.params
                ),
              }
            : undefined,
        AnnualRegistries:
          staffParams?.activeRole === Role.REGISTRY
            ? {
                select: { matricule: true, annual_registry_id: true },
                where: this.getStaffWhereInput(
                  staffParams?.academic_year_id,
                  staffParams?.params
                ),
              }
            : undefined,
        AnnualTeachers:
          staffParams?.activeRole === Role.TEACHER
            ? {
                select: {
                  annual_teacher_id: true,
                  AnnualClassroomDivisions: {
                    select: { annual_coordinator_id: true },
                  },
                },
                where: this.getStaffWhereInput(
                  staffParams?.academic_year_id,
                  staffParams?.params
                ),
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
}
