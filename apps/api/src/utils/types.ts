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
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  REGISTRY = 'REGISTRY',
  COORDINATOR = 'COORDINATOR',
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
  year_status: AcademicYearStatus;
  year_code: string;
};

export type DesirializeRoles = {
  login_id: string;
  school_id?: string;
  annualStudent?: {
    annual_student_id: string;
    activeSemesters: number[];
    classroom_code: string,
    classroom_level: number,
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
    classroomDivisions: string[];
    teacher_id: string;
  };
  annualRegistry?: {
    annual_registry_id: string;
  };
  tutorStudentIds?: string[];
  activeYear?: ActiveYear;
};

export type DeserializeSessionData = DesirializeRoles & Person;

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: PassportSession;
    };
  }
}
