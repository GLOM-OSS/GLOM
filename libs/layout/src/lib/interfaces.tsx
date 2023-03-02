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
  route: string;
  children: NavChild[];
}

export type Gender = 'Male' | 'Female';
export type Lang = 'en' | 'fr';

export type UserAction =
  | { type: 'LOAD_USER'; payload: { user: User } }
  | { type: 'CLEAR_USER' };

export type PersonnelRole =
  | 'secretary'
  | 'teacher'
  | 'registry'
  | 'coordinator';

export type UserRole = PersonnelRole | 'student';

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

export const getUserRoles = (
  { annualConfigurator, annualRegistry, annualTeacher, annualStudent }: User,
  callingApp: 'admin' | 'personnel' | 'student'
): UserRole[] => {
  if (callingApp === 'student' && annualStudent) return ['student'];
  const newRoles: (UserRole | undefined)[] = [
    annualConfigurator ? 'secretary' : undefined,
    annualRegistry ? 'registry' : undefined,
    annualTeacher ? 'teacher' : undefined,
    annualTeacher?.classroomDivisions &&
    annualTeacher.classroomDivisions.length > 0
      ? 'coordinator'
      : undefined,
  ];
  const Roles: UserRole[] = newRoles.filter(
    (_) => _ !== undefined
  ) as UserRole[];

  return Roles.sort((a, b) => (a > b ? 1 : -1));
};
