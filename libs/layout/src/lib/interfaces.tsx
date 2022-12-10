import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { AcademicYearInterface } from '@squoolr/auth';

export interface NavChild {
  title: string;
  route: string;
  page_title: string;
}

export interface NavItem {
  id: number;
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  title: string;
  children: NavChild[];
}

export type Gender = 'Male' | 'Female';
export type Lang = 'En' | 'Fr';

export type UserAction =
  | { type: 'LOAD_USER'; payload: { user: User } }
  | { type: 'CLEAR_USER' };

export type PersonnelRole =
  | 'secretary'
  | 'teacher'
  | 'registry'
  | 'coordinator';

export interface ClassroomDivisionInterface {
  annual_classroom_division_id: string;
  annual_classroom_id: string;
  classroom_name: string;
  classroom_short_name: string;
  classroom_code: string;
}

export interface User {
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
    coordinates?: ClassroomDivisionInterface[]; //TODO change type to string[] representing classroom_division_id, change coordinates to classroomDivisions
  };
  annualRegistry?: {
    annual_registry_id: string;
  };
  activeYear: AcademicYearInterface;
}
