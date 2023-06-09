import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface INavChild {
  title: string;
  route: string;
  page_title: string;
}

export interface INavItem {
  id: number;
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  title: string;
  route: string;
  children: INavChild[];
}

export type Gender = 'Male' | 'Female';
export type Lang = 'en' | 'fr';

export type UserAction =
  | { type: 'LOAD_USER'; payload: { user: IUser } }
  | { type: 'CLEAR_USER' };

export type PersonnelRole =
  | 'secretary'
  | 'teacher'
  | 'registry'
  | 'coordinator';

export type UserRole = PersonnelRole | 'student' | 'administrator';

export interface AcademicYearInterface {
  academic_year_id: string;
  code: string;
  starting_date: Date;
  ending_date: Date;
  year_status: 'inactive' | 'finished' | 'active';
}

export interface IUser {
  person_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birthdate: Date;
  gender: Gender;
  national_id_number: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  email: string;
  preferred_lang: Lang;
  image_ref?: string;
  login_id: string;
  annualConfigurator?: {
    annual_configurator_id: string;
    is_sudo: boolean;
  };
  annualTeacher?: {
    annual_teacher_id: string;
    hourly_rate: number;
    origin_institute?: string;
    has_signed_convention: boolean;
    teacher_id: string;
    classroomDivisions?: string[];
  };
  annualRegistry?: {
    annual_registry_id: string;
  };
  annualStudent?: {
    annual_student_id: string;
    student_id: string;
    activeSemesters: number[];
    classroom_code: string;
    classroom_level: number;
  };
  activeYear: AcademicYearInterface;
}
