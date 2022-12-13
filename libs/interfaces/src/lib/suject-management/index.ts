export interface UEMajor {
  major_id: string;
  major_name: string;
  number_of_years: number;
}

export interface CreateCreditUnit {
  major_id: string;
  credit_unit_code: string;
  credit_unit_name: string;
  credit_points: number;
  semester_number: number;
}

export interface CreditUnit extends CreateCreditUnit {
  annual_credit_unit_id: string;
}

export interface CreateCreditUnitSubject {
  weighting: number;
  objective: string;
  credit_points: number;
  subject_title: string;
  credit_unit_id: string;
  annual_teacher_id: string;
  annual_credit_unit_id: string;
  subjectParts: {
    subject_part_id: string;
    number_of_hours: number;
  }[];
}

export interface CreditUnitSubject extends CreateCreditUnitSubject {
  annual_credit_unit_has_subject_id: number;
}
