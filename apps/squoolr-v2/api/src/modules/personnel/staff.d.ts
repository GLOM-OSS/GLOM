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

export interface IStaffService<T> {
  findOne: (annual_personnel_id: string) => Promise<T>;
  findAll: (academic_year_id: string, params?: QueryParams) => Promise<T[]>;
}
