import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role, StaffRole } from '../../utils/enums';
import {
  AnnualStaffCreateInput,
  CreateStaffInput,
  StaffSelectParams,
} from './staff';
import { StaffEntity } from './staff.dto';
import { DefaultArgs } from '@prisma/client/runtime';

export class StaffArgsFactory {
  static getStaffWhereInput = (staffWhereParams?: StaffSelectParams) => ({
    academic_year_id: staffWhereParams?.academic_year_id,
    is_deleted: staffWhereParams?.params?.is_deleted ?? false,
    Login: staffWhereParams?.params?.keywords
      ? Prisma.validator<Prisma.LoginWhereInput>()({
          Person: {
            OR: {
              email: {
                search: staffWhereParams.params.keywords,
              },
              last_name: {
                search: staffWhereParams.params.keywords,
              },
              first_name: {
                search: staffWhereParams.params.keywords,
              },
            },
          },
        })
      : undefined,
  });

  static getStaffSelect = (staffParams?: StaffSelectParams) => {
    const { is_deleted, academic_year_id, Login } =
      this.getStaffWhereInput(staffParams);
    return {
      matricule: true,
      is_deleted: true,
      Login: Prisma.validator<Prisma.LoginFindManyArgs>()({
        select: {
          login_id: true,
          AnnualConfigurators: {
            select: { matricule: true, annual_configurator_id: true },
            where: { academic_year_id, is_deleted, Login },
          },
          AnnualRegistries: {
            select: { matricule: true, annual_registry_id: true },
            where: { academic_year_id, is_deleted, Login },
          },
          Teacher: {
            select: {
              AnnualTeachers: {
                select: {
                  annual_teacher_id: true,
                  AnnualClassroomDivisions: {
                    select: { annual_classroom_division_id: true },
                  },
                },
                where: { academic_year_id, is_deleted, Teacher: { Login } },
              },
            },
          },
          Person: {
            select: {
              national_id_number: true,
              preferred_lang: true,
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
    };
  };

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

  static getTeacherSelect = () => {
    const { is_deleted, ...staffSelect } = StaffArgsFactory.getStaffSelect();
    return Prisma.validator<Prisma.AnnualTeacherSelect>()({
      has_signed_convention: true,
      teaching_grade_id: true,
      annual_teacher_id: true,
      origin_institute: true,
      hourly_rate: true,
      is_deleted,
      Teacher: {
        select: {
          matricule: true,
          private_code: true,
          has_tax_payers_card: true,
          tax_payer_card_number: true,
          teacher_type_id: true,
          ...staffSelect,
        },
      },
    });
  };

  private static select = StaffArgsFactory.getStaffSelect();
  static getStaffEntity = ({
    matricule,
    is_deleted,
    Login: {
      login_id,
      Person,
      Teacher,
      Logs: [log],
      AnnualRegistries: [registry],
      AnnualConfigurators: [configrator],
    },
  }: Prisma.AnnualConfiguratorGetPayload<{
    select: typeof StaffArgsFactory.select;
  }>) => {
    let roles: StaffRole[] = [];
    const annualTeachers =
      Teacher?.AnnualTeachers?.length > 0 ? Teacher.AnnualTeachers : [];
    return new StaffEntity({
      login_id,
      ...Person,
      matricule,
      is_deleted,
      last_connected: log?.logged_in_at ?? null,
      annual_registry_id: registry?.annual_registry_id,
      annual_configurator_id: configrator?.annual_configurator_id,
      annual_teacher_id: annualTeachers[0]?.annual_teacher_id,
      roles: [
        { configrator },
        { registry },
        { teacher: annualTeachers[0] },
      ].reduce<StaffRole[]>((accRoles, _) => {
        roles = _.configrator
          ? [...accRoles, StaffRole.CONFIGURATOR]
          : _.registry
          ? [...accRoles, StaffRole.REGISTRY]
          : _.teacher
          ? _.teacher.AnnualClassroomDivisions.length > 0
            ? [...accRoles, StaffRole.TEACHER, StaffRole.COORDINATOR]
            : [...accRoles, StaffRole.TEACHER]
          : accRoles;
        return roles;
      }, []),
      role: roles[0],
    });
  };
}
