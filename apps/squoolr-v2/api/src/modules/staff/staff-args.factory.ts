import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from '../../utils/enums';
import {
  AnnualStaffCreateInput,
  CreateStaffInput,
  StaffSelectParams,
} from './staff';
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
        Teacher:
          staffParams?.activeRole === Role.TEACHER
            ? {
                select: {
                  AnnualTeachers: {
                    select: {
                      annual_teacher_id: true,
                      AnnualClassroomDivisions: {
                        select: { annual_coordinator_id: true },
                      },
                    },
                    where: this.getStaffWhereInput(staffParams),
                  },
                },
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
    private_code,

    password,
    person_id,
    school_id,
    academic_year_id,
    ...personPayload
  }: CreateStaffInput) =>
    Prisma.validator<AnnualStaffCreateInput>()({
      Login: {
        connectOrCreate: {
          create: {
            is_personnel: true,
            password: bcrypt.hashSync(password, Number(process.env.SALT)),
            Person: {
              connectOrCreate: {
                create: personPayload,
                where: { person_id },
              },
            },
            School: { connect: { school_id } },
          },
          where: { person_id_school_id: { person_id, school_id } },
        },
      },
      AcademicYear: { connect: { academic_year_id } },
    });

  static getTeacherSelect = () =>
    Prisma.validator<Prisma.AnnualTeacherSelect>()({
      has_signed_convention: true,
      teaching_grade_id: true,
      annual_teacher_id: true,
      origin_institute: true,
      hourly_rate: true,
      Teacher: {
        select: {
          matricule: true,
          has_tax_payers_card: true,
          tax_payer_card_number: true,
          teacher_type_id: true,
          ...StaffArgsFactory.getStaffSelect(),
        },
      },
    });
}
