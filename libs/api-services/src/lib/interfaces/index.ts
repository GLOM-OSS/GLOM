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
