import { AcademicYearStatus, Gender, Lang, Person, Role } from '@prisma/client';

export type RecordValue =
  | number
  | string
  | Date
  | Lang
  | Gender
  | boolean
  | UserRole[];

export type UserRole = {
  user_id: string;
  role: Role;
};

export type PassportUser = {
  login_id: string;
  cache_key: string;
  academic_year_id?: string;
};

export type ActiveYear = {
  academic_year_id: string;
  starting_date: Date;
  ending_date: Date;
  year_status: AcademicYearStatus;
  year_code: string;
};

export type AnnualSessionData = {
  annualStudent?: {
    student_id: string;
    annual_student_id: string;
    activeSemesters: number[];
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
  };
  annualRegistry?: {
    annual_registry_id: string;
  };
  tutorStudentIds?: string[];
  activeYear?: ActiveYear;
};

export type ValidatedUser = Express.User & { session: PassportUser };

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: PassportUser;
    };
  }
}
declare global {
  namespace Express {
    interface User extends AnnualSessionData, Person {
      login_id: string;
      school_id?: string;
    }
  }
}
