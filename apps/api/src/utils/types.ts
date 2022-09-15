import {
  AnnualConfigurator,
  AnnualRegistry,
  AnnualTeacher,
  Gender,
  Lang,
  Student,
} from '@prisma/client';

export type RecordValue =
  | number
  | string
  | Date
  | Lang
  | Gender
  | boolean
  | UserRole[];
export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  REGISTRY = 'REGISTRY',
  CONFIGURATOR = 'CONFIGURATOR',
}
export type UserRole = {
  user_id: string;
  role: Role;
};

export type PassportSession = {
  log_id: string;
  login_id: string;
  roles: UserRole[];
};

export type DeserializeSessionData = {
  login_id: string; //admin,
  annualStudent?: Student; //Student
  //Personnel
  annualConfigurator?: AnnualConfigurator;
  annualTeacher?: AnnualTeacher;
  annualRegistry?: AnnualRegistry;
};

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: PassportSession;
    };
  }
}
