export interface UEMajor {
  major_id: string;
  major_code: string;
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

export interface SubjectPart {
  annual_teacher_id: string;
  subject_part_id: string;
  number_of_hours: number;
}

export interface CreateCreditUnitSubject {
  weighting: number;
  objective: string;
  subject_code: string;
  subject_title: string;
  annual_credit_unit_id: string;
  subjectParts: SubjectPart[];
}

export interface CreditUnitSubject {
  weighting: number;
  objective: string | null;
  subject_code: string;
  subject_title: string;
  annual_credit_unit_id: string;
  subjectParts: SubjectPart[];
  main_teacher_fullname: string;
  annual_credit_unit_subject_id: string;
}
