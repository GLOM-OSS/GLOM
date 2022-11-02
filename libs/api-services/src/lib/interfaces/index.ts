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
  created_at: Date;
  is_deleted: boolean;
  cycle_name: 'BACHELORS' | 'MASTER' | 'DOCTORATE' | 'DUT' | 'BTS' | 'DTS';
  department_acronym: string;
}

export type RoleShort = 'Te' | 'Se' | 'S.A.' | 'Co';
export interface Personnel {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  login_id: string;
  personnel_code: string;
  annual_configurator_id?: string;
  annual_registry_id?: string;
  annual_teacher_id?: string;
  last_connected: Date;
  roles: RoleShort[];
}
