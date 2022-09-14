import {
  AnnualConfigurator,
  AnnualRegistry,
  AnnualTeacher,
  Gender,
  Lang,
  Student,
} from '@prisma/client';

export type RecordValue = number | string | Date | Lang | Gender | boolean;
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  REGISTRY = 'REGISTRY',
  CONFIGURATOR = 'CONFIGURATOR',
}

export type SerializeSessionData = {
  user_id: string;
  role?: UserRole;
};

export type DeserializeSessionData = {
  login_id: string; //admin,
  student?: Student; //Student
  //Personnel
  annualConfigurator?: AnnualConfigurator;
  annualTeacher?: AnnualTeacher;
  annualRegistry?: AnnualRegistry;
};
