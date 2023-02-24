interface SubjectMarkStatus {
  is_ca_available: boolean;
  is_exam_available: boolean;
  is_resit_available: boolean;
}

export interface Course extends SubjectMarkStatus {
  annual_credit_unit_subject_id: string;
  subject_code: string;
  subject_title: string;
  classroomAcronyms: string[];
  has_course_plan: boolean;
  objective: string;
  semester?: number;
  number_of_students?: number
}

export interface EvaluationHasStudent {
  evaluation_has_student_id: string;
  matricule: string;
  fullname: string;
  mark: number | null;
  last_updated: Date | null;
}

export interface AnonimatedEvaluationHasStudent extends EvaluationHasStudent {
  anonymity_code: string;
}

export enum EvaluationTypeEnum {
  CA = 'CA',
  EXAM = 'EXAM',
}
export enum EvaluationSubTypeEnum {
  CA = 'CA',
  EXAM = 'EXAM',
  RESIT = 'RESIT',
  PRACTICAL = 'PRACTICAL',
  ASSIGNMENT = 'ASSIGNMENT',
  GUIDED_WORK = 'GUIDED_WORK',
}
export interface EvaluationSubType {
  evaluation_type: EvaluationTypeEnum;
  annual_evaluation_sub_type_id: string;
  evaluation_sub_type_name: EvaluationSubTypeEnum;
}

export interface Evaluation {
  evaluation_id: string;
  subject_title: string;
  is_published: boolean;
  is_anonimated: boolean;
  examination_date: Date | null;
  evaluation_sub_type_name: EvaluationSubTypeEnum;
}

export interface CreditUnitMarkStatus {
  credit_points: number;
  credit_unit_code: string;
  credit_unit_name: string;
  annual_credit_unit_id: string;
  availability_percentage: number;
  is_exam_published: boolean;
  is_resit_published: boolean;
  subjectMarkStatus: Omit<Course, 'classroomAcronyms' | 'has_course_plan'>[];
}
