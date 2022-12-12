export interface CreditUnit {
  annual_credit_unit_id: string;
  academic_year_id: string;
  major_id: string;
  credit_unit_code: string;
  credit_unit_name: string;
  credit_points: number;
  semester_number: number;
}

export interface CreditUnit {
  annual_credit_unit_id: string;
  academic_year_id: string;
  major_id: string;
  credit_unit_code: string;
  credit_unit_name: string;
  credit_points: number;
  semester_number: number;
}

export interface CreditUnitSubject {
  annual_credit_unit_has_subject_id: number;
  has_objective: boolean;
  suject_code: string;
  subject_id: string;
  subject_title: string;
  weighting: number;
  subjectParts: {
    subject_part_id: string;
    subject_part_name: string;
    number_of_hours: number;
  }[];
}

export interface CreateCreditUnit {
  major_id: string;
  credit_points: number;
  credit_unit_code: string;
  credit_unit_name: string;
  semester_number: number;
}

export interface CreateCreditUnitSubject {
  weighting: number;
  credit_points: number;
  credit_unit_id: string;
  annual_teacher_id: string;
  subject_title: string;
  objective: string;
  subjectParts: {
    subject_part_id: string;
    number_of_hours: number;
  }[];
}
