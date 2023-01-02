export interface Person {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  phone_number: string;
  gender: 'Male' | 'Female';
  national_id_number: string;
  password?: string;
  address?: string;
}

export interface Teacher extends Person {
  teaching_grade_id: string;
  teacher_type_id: string;
  origin_institute: string;
  hourly_rate: number;
  has_signed_convention: boolean;
  has_tax_payers_card: boolean;
  tax_payer_card_number?: string;
  annual_teacher_id?:string;
}

export interface School {
  school_name: string;
  school_acronym: string;
  school_email: string;
  school_phone_number: string;
  initial_year_starts_at: Date;
  initial_year_ends_at: Date;
}

export interface SchoolDemand {
  school_code: string;
  school_name: string;
  school_acronym: string;
  school_email: string;
  school_phone_number: string;
  demand_status: string;
}

export interface Department {
  department_code: string;
  department_name: string;
  department_acronym: string;
  created_at: Date;
  is_deleted: boolean;
}

export interface Major {
  major_name: string;
  major_acronym: string;
  major_code: string;
  major_id: string;
  created_at: Date;
  is_deleted: boolean;
  cycle_name: 'BACHELORS' | 'MASTER' | 'DOCTORATE' | 'DUT' | 'BTS' | 'DTS';
  department_acronym: string;
}

export  interface Classroom {
  classroom_code: string;
  classroom_acronym: string;
  classroom_name: string;
  classroom_level: number;
  registration_fee: number;
  total_fee_due: number;
  annual_coordinator_id: string;
}


export type RoleShort = 'Te' | 'Se' | 'S.A.' | 'Co';
export interface Personnel extends Omit<Person, 'password'> {
  login_id: string;
  personnel_id: string;
  personnel_code: string;
  last_connected: Date;
  roles: RoleShort[];
}

export interface TemplateOptions {
  ends_at: Date;
  starts_at: Date;
  classroomCodes: string[];
  reuse_coordinators_configs?: boolean;
  reuse_registries_configs?: boolean;
  personnelConfig: {
    reuse_configurators?: boolean;
    reuse_registries?: boolean;
    reuse_coordinators?: boolean;
    reuse_teachers?: boolean;
  };
}
