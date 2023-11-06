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
export type CreateStaffInput = Prisma.PersonCreateInput & {
  academic_year_id: string;
  password: string;
  matricule: string;
  person_id: string;
  school_id: string;
};

export interface IStaffService<T> {
  findOne: (annual_personnel_id: string) => Promise<T>;
  findAll: (staffParams?: StaffSelectParams) => Promise<T[]>;
  create: (
    payload: CreateStaffInput,
    created_by: string,
    private_code: string
  ) => Promise<T>;
}
