import { http } from '@squoolr/axios';
import {
    ActivateAssessment,
    Assessment,
    AssessmentStatistics,
    Question,
    QuestionAnswer,
    StudentAssessmentAnswer
} from '@squoolr/interfaces';

export async function getAssessment(assessment_id: string) {
  const { data } = await http.get<Assessment>(`/assessments/${assessment_id}`);
  return data;
}

export async function createNewAssessment(
  annual_credit_unit_subject_id: string
) {
  const { data } = await http.post<Assessment>(`/assessments/new`, {
    annual_credit_unit_subject_id,
  });
  return data;
}

export async function deleteAssessment(assessment_id: string) {
  const { data } = await http.delete(`/assessments/${assessment_id}/delete`);
  return data;
}

export async function activateAssessment(
  assessment_id: string,
  { assessment_date, duration }: ActivateAssessment
) {
  const { data } = await http.put(`/assessments/${assessment_id}/activate`, {
    assessment_date,
    duration,
  });
  return data;
}

export async function publishAssessment(
  assessment_id: string,
  evaluation_id?: string
) {
  const { data } = await http.put(`/assessments/${assessment_id}/publish`, {
    evaluation_id,
  });
  return data;
}

export async function getAssessmentQuestions(assessment_id: string) {
  const { data } = await http.get<Question[]>(
    `/assessments/${assessment_id}/questions`
  );
  return data;
}

export async function getStudentAssessmentMarks(assessment_id: string) {
  const { data } = await http.get<StudentAssessmentAnswer[]>(
    `/assessments/${assessment_id}/marks`
  );
  return data;
}

export async function getStudentAnswers(
  assessment_id: string,
  annual_student_id: string
) {
  const { data } = await http.get<QuestionAnswer[]>(
    `/assessments/${assessment_id}/${annual_student_id}/answers`
  );
  return data;
}

export async function getAssessmentStats(
  assessment_id: string,
  distribution_interval: number
) {
  const { data } = await http.get<AssessmentStatistics>(
    `/assessments/${assessment_id}/statistics`,
    { params: { distribution_interval } }
  );
  return data;
}

export * from './questions';
