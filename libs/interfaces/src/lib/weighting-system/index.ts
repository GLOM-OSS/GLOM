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
  cycle_id: string;
  weighting_system: number;
}

export interface CreateGradeWeighting {
  minimum: number;
  maximum: number;
  grade_id: string;
  point: number;
  observation: string;
}

export interface GradeWeighting extends Omit<CreateGradeWeighting, 'grade_id'> {
  grade_value: string;
  annual_grade_weighting_id: string;
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
  carrry_over_system_id: string;
  carrry_over_system: CarryOver;
}

export enum EvaluationType {
  CA = 'CA',
  EXAM = 'EXAM',
}
export interface SaveEvaluationTypeWeighting {
  minimum_modulation_score: number;
  evaluationTypeWeighting: {
    evaluation_type: EvaluationType;
    weight: number;
  }[];
}

export interface SemesterExamAccess {
    sesmeter_number: number;
    payment_percentage: number;
}