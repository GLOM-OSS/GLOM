import { AcademicYearStatus, Gender, Lang, Person } from '@prisma/client';

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
  cookie_age: number;
  job_name?: string;
  academic_year_id?: string;
};

export type ActiveYear = {
  academic_year_id: string;
  starting_date: Date;
  ending_date: Date;
  status: AcademicYearStatus;
  code: string;
};

export type DeserializeSessionData = {
  login_id: string;
  annualStudent?: {
    annual_student_id: string;
    student_id: string;
  }; //Student
  //Personnel
  annualConfigurator?: {
    annual_configurator_id: string;
    is_sudo: boolean;
  };
  annualTeacher?: {
    annual_teacher_id: string;
    hourly_rate: number;
    origin_institute: string;
    has_signed_convention: boolean;
    teacher_id: string;
  };
  annualRegistry?: {
    annual_registry_id: string;
  };
  activeYear?: ActiveYear;
} & Person;

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: PassportSession;
    };
  }
}
