export enum CycleName {
  BTS = 'BTS',
  DUT = 'DUT',
  DTS = 'DTS',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORAT = 'DOCTORAT',
}

export enum CycleType {
  SHORT,
  LONG,
}

export interface Cycle {
  cycle_id: string;
  cycle_name: CycleName;
  cycle_type: CycleType;
  number_of_years: number;
}

export interface CreateWeightingSystem {
  weighting_system: number;
}

export interface CreateGradeWeighting {
  point: number;
  minimum: number;
  maximum: number;
  grade_id: string;
  observation: string;
}

export interface GradeWeighting extends CreateGradeWeighting {
  grade_value: string;
  annual_grade_weighting_id: string;
}

export interface Grade {
  grade_id: string;
  grade_value: string;
}

export interface CreateAcademicProfile {
  minimum_score: number;
  maximum_score: number;
  comment: string;
}

export interface AcademicProfile extends CreateAcademicProfile {
  academic_profile_id: string;
}

export enum CarryOver {
  SUBJECT = 'SUBJECT',
  CREDIT_UNIT = 'CREDIT_UNIT',
}

export interface CarryOverSystem {
  carry_over_system_id: string;
  carry_over_system: CarryOver;
}

export enum EvaluationType {
  CA = 'CA',
  EXAM = 'EXAM',
}
export interface EvaluationTypeWeighting {
  minimum_modulation_score: number;
  evaluationTypeWeightings: {
    evaluation_type: EvaluationType;
    weight: number;
  }[];
}

export interface SemesterExamAccess {
  annual_semester_exam_access_id: string;
  annual_sesmeter_number: 1 | 2;
  payment_percentage: number;
}
