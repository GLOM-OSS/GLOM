import { Prisma } from '@prisma/client';
import { BatchPayload, QueryParams } from '../module';

export type StaffIDs = {
  annual_configurator_id?: string;
  annual_registry_id?: string;
  annual_teacher_id?: string;
  annual_coordinator_id?: string;
};

export type StaffSelectParams = {
  params?: QueryParams;
  activeRole?: StaffRole;
  academic_year_id?: string;
};

export type AnnualStaffCreateInput = Omit<
  Prisma.AnnualConfiguratorCreateInput,
  'matricule'
>;

export type CreateStaffInput = Prisma.PersonCreateInput &
  Pick<
    Prisma.AnnualRegistryCreateManyInput,
    'matricule' | 'private_code' | 'academic_year_id'
  > &
  Pick<Prisma.LoginCreateManyInput, 'password' | 'school_id'>;
export type UpdateStaffInput = Partial<
  Prisma.PersonCreateInput & { delete: boolean }
>;

type TeacherCreateInput = Omit<Prisma.TeacherCreateManyInput, 'teacher_id'> &
  Pick<
    Prisma.AnnualTeacherCreateManyInput,
    | 'has_signed_convention'
    | 'hourly_rate'
    | 'origin_institute'
    | 'teaching_grade_id'
  >;
export type CreateTeacherInput = CreateStaffInput & TeacherCreateInput;
export type UpdateTeacherInput =
  | UpdateStaffInput & Partial<TeacherCreateInput & { is_deleted: true }>;

export type CreateCoordinatorInput = {
  annual_teacher_id: string;
  annualClassroomIds: string[];
};
export type UpdateCoordinatorInput = Omit<
  CreateCoordinatorInput,
  'annual_teacher_id'
>;
export type StaffRoleIDs = {
  [x in StaffRole]: string[];
};

export interface IStaffService<
  T,
  P = CreateStaffInput | CreateTeacherInput | CreateCoordinatorInput,
  U = UpdateStaffInput | UpdateTeacherInput | UpdateCoordinatorInput
> {
  findOne: (annual_staff_id: string) => Promise<T>;
  findAll: (staffParams?: StaffSelectParams) => Promise<T[]>;
  create: (
    payload: P,
    created_by: string
  ) => Promise<P extends CreateCoordinatorInput ? BatchPayload : T>;
  update: (
    annual_staff_id: string,
    payload: U,
    audited_by: string
  ) => Promise<void>;
  resetPasswords?: (
    annualStaffIds: string[],
    disabled_by: string
  ) => Promise<BatchPayload>;
}
