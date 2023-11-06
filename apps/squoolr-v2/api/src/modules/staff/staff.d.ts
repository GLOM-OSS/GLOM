import { Prisma } from '@prisma/client';
import { QueryParams } from '../module';

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
export type CreateStaffInput = Prisma.PersonCreateInput &
  Pick<
    Prisma.AnnualRegistryCreateManyInput,
    'matricule' | 'private_code' | 'academic_year_id'
  > &
  Pick<Prisma.LoginCreateManyInput, 'password' | 'school_id'>;

export type CreateTeacherInput = CreateStaffInput &
  Omit<Prisma.TeacherCreateManyInput, 'teacher_id'> &
  Pick<
    Prisma.AnnualTeacherCreateManyInput,
    | 'has_signed_convention'
    | 'hourly_rate'
    | 'origin_institute'
    | 'teaching_grade_id'
  >;
export type CreateCoordinatorInput = {
  annual_teacher_id: string;
  classroomIds: string[];
};

export interface IStaffService<T> {
  findOne: (annual_personnel_id: string) => Promise<T>;
  findAll: (staffParams?: StaffSelectParams) => Promise<T[]>;
  create: (
    payload: CreateStaffInput | CreateTeacherInput | CreateCoordinatorInput,
    created_by: string
  ) => Promise<T>;
}
