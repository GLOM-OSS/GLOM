export interface Person {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  phone_number: string;
  gender: 'Male' | 'Female';
  national_id_number: string;
  password: string;
}

export interface Teacher extends Person {
  teacher_grade_id: string;
  teacher_type_id: string;
  origin_institute: string;
  hourly_rate: number;
  has_signed_convention: boolean;
  has_tax_payer_card: boolean;
  tax_payer_card_number?: number;
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
