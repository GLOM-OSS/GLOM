import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from '../../utils/enums';
import { CreateStaffInput, StaffSelectParams } from './staff';
export class StaffArgsFactory {
  static getStaffWhereInput = ({
    academic_year_id,
    params,
  }: StaffSelectParams) => ({
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
                where: this.getStaffWhereInput(staffParams),
              }
            : undefined,
        AnnualRegistries:
          staffParams?.activeRole === Role.REGISTRY
            ? {
                select: { matricule: true, annual_registry_id: true },
                where: this.getStaffWhereInput(staffParams),
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
                where: this.getStaffWhereInput(staffParams),
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

  static getStaffCreateInput = ({
    matricule,
    person_id,
    school_id,
    academic_year_id,
    password,
    ...personPayload
  }: CreateStaffInput) =>
    Prisma.validator<Prisma.AnnualConfiguratorCreateInput>()({
      matricule,
      Login: {
        connectOrCreate: {
          create: {
            is_personnel: true,
            password: bcrypt.hashSync(password, Number(process.env.SALT)),
            Person: {
              connectOrCreate: {
                create: personPayload,
                where: { email: personPayload.email },
              },
            },
            School: { connect: { school_id } },
          },
          where: { person_id_school_id: { person_id, school_id } },
        },
      },
      AcademicYear: { connect: { academic_year_id } },
    });
}
