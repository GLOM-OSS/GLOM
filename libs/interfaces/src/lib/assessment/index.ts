export interface CreateAssessment {
  number_per_group: number;
  submission_type: 'Individual' | 'Group';
  annual_credit_unit_subject_id: string;
}
export interface Assessment extends CreateAssessment {
  created_at: Date;
  total_mark: number;
  assessment_id: string;
  is_published: boolean;
  duration: number | null;
  chapter_id: string | null;
  assessment_date: Date | null;
  evaluation_sub_type_name: string | null;
}

export interface CreateQuestionOption {
  question_id: string;
  is_answer: boolean;
  option: string;
}

export interface CreateQuestion {
  question: string;
  question_mark: number;
  assessment_id: string;
  question_answer: string | null;
  question_type: 'MCQ' | 'Structural' | 'File';
  questionOptions: Omit<CreateQuestionOption, 'question_id'>[];
}

export interface QuestionOption extends CreateQuestionOption {
  question_option_id: string;
}

export interface QuestionResource {
  question_resource_id: string;
  resource_ref: string;
  question_id: string;
  caption: number;
}

export interface Question extends CreateQuestion {
  question_id: string;
  questionOptions: QuestionOption[];
  questionResources: QuestionResource[];
}

export interface QuestionAnswer extends Question {
  response: string | null;
  answeredOptionIds: string[];
  teacher_comment: string | null;
}

export interface StudentAssessmentAnswer {
  fullname: string;
  matricule: string;
  submitted_at: Date;
  total_score: number;
  annual_student_id: string;
  questionAnswers: QuestionAnswer[];
}

export interface ScoreDistribution {
  number_of_students: number;
  average_score: number;
}

export interface AssessmentStatistics {
  distribution_interval: number;
  total_number_of_students: number;
  average_score: number;
  best_score: number;
  worst_score: number;
  scoreDistributions: ScoreDistribution[];
}

export interface EditQuestionInterface {
  question: string;
  question_mark: number;
  question_answer: string | null;
  question_type: 'MCQ' | 'Structural' | 'File';

  deletedOptionIds: string[];
  deletedResourceIds: string[];
  editedOptions: QuestionOption[];
  newOptions: CreateQuestionOption[];
}

export interface ActivateAssessment {
  duration: number;
  assessment_date: Date;
  assessment_time: Date;
}

export interface CreateStudentAnswers {
  answers: {
    answered_option_id?: string;
    question_id: string;
    response?: string;
  }[];
}

export interface AssignmentGroup {
  effectif: number; 
  group_code: string;
  assessment_id: string;
  annual_student_id: string;
}