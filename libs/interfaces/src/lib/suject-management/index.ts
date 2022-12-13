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

export interface CreditUnitSubject extends CreateCreditUnitSubject {
  annual_credit_unit_has_subject_id: number;
}
