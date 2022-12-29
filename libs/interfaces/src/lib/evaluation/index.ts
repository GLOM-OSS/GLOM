export interface Course {
  annual_credit_unit_subject: string;
  credit_unit_code: string;
  credit_unit_name: string;
  classroom_acronym: string;
  is_planified: boolean;
}

export interface EvaluationHasStudent {
  matricule: string;
  fullname: string;
  mark: number;
  last_updated: Date;
}

export interface AnonimatedEvaluationHasStudent
  extends Omit<EvaluationHasStudent, 'fullname'> {
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

export interface UEMarkTraking {
  credit_points: number;
  credit_unit_code: string;
  credit_unit_name: string;
  availability_percentage: number;
}

export interface UVMarkTraking
  extends Omit<Course, 'is_planified' | 'classroom_acronym'> {
  is_ca_available: boolean;
  is_exam_available: boolean;
  is_receit_available: boolean;
}
