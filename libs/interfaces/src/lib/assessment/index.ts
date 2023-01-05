export interface Assessment {
  created_at: Date;
  duration: number;
  total_mark: number;
  assessment_id: string;
  chapter_id: Date | null;
  assessment_date: Date | null;
  annual_credit_unit_subject_id: string;
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
  questionOptions: Omit<CreateQuestionOption, 'question_id'>[];
}

export interface QuestionOption extends CreateQuestionOption {
  question_option_id: string;
}

export interface QuestionResource {
  question_resource_id: string;
  resource_ref: string;
  question_id: string;
}

export interface Question extends CreateQuestion {
  question_id: string;
  questionOptions: QuestionOption[];
  questionResources: QuestionResource[];
}

export interface QuestionAnswer extends Omit<Question, 'questionResources'> {
  answered_option_id: string;
}

export interface StudentAssessmentAnswer {
  fullname: string;
  matricule: string;
  submitted_at: Date;
  total_score: number;
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
  deletedOptionIds: string[];
  deletedResourceIds: string[];
  editedOptions: QuestionOption[];
}
