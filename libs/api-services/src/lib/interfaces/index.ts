export interface Person {
  fisrt_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  gender: 'Male' | 'Female';
  national_id_number: string;
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
