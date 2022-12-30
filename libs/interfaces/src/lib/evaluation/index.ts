interface SubjectMarkStatus {
  is_ca_available: boolean;
  is_exam_available: boolean;
  is_resit_available: boolean;
}

export interface Course extends SubjectMarkStatus {
  annual_credit_unit_subject_id: string;
  subject_code: string;
  subject_title: string;
  classroom_acronyms: string[];
  has_course_plan: boolean;
}

export interface EvaluationHasStudent {
  evaluation_has_student_id: string;
  matricule: string;
  fullname: string;
  mark: number;
  last_updated: Date;
}

export interface AnonimatedEvaluationHasStudent
  extends Omit<EvaluationHasStudent, 'fullname' | 'matricule'> {
  anonymity_code: string;
}

export interface EvaluationSubType {
  evaluation_sub_type_id: string;
  evaluation_sub_type_name: string;
}

export interface Evaluation {
  evaluation_id: string;
  subject_name: string;
  is_published: boolean;
  is_anonimated: boolean;
  examination_date: boolean;
  evaluation_sub_type_name: string;
}

export interface CreditUnitMarkStatus {
  credit_points: number;
  credit_unit_code: string;
  credit_unit_name: string;
  annual_credit_unit_id: string;
  availability_percentage: number;
  subjectMarkStatus: Omit<Course, 'classroomAcronyms' | 'has_course_plan'>[];
}
