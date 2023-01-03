import { http } from '@squoolr/axios';
import {
  Evaluation,
  EvaluationHasStudent,
  EvaluationSubType,
} from '@squoolr/interfaces';

export async function getEvaluations(params?: {
  major_code?: string;
  semester_number?: number;
  annual_credit_unit_id?: string;
  annual_credit_unit_subject_id?: string;
}) {
  const { data } = await http.get<Evaluation[]>(`/evaluations/all`, { params });
  return data;
}

export function getEvaluation(evaluation_id: string): Promise<Evaluation>;
export function getEvaluation(params: {
  annual_evaluation_sub_type_id: string;
  annual_credit_unit_subject_id: string;
}): Promise<Evaluation>;

export async function getEvaluation(params: unknown) {
  const { data } = await http.get<Evaluation>(`/evaluations`, {
    ...(typeof params === 'string'
      ? { params: { evaluation_id: params } }
      : { params }),
  });
  return data;
}

export async function getEvaluationSubTypes() {
  const { data } = await http.get<EvaluationSubType[]>(
    `/evaluations/sub-types`
  );
  return data;
}

export async function getEvaluationHasStudents(evaluation_id: string) {
  const { data } = await http.get<EvaluationHasStudent[]>(
    `/evaluations/${evaluation_id}/students`
  );
  return data;
}

export async function setEvaluationDate(
  evaluation_id: string,
  examination_date: Date
) {
  await http.put(`/evaluations/${evaluation_id}/exam-date`, {
    examination_date,
  });
}

export async function anonimateEvaluation(evaluation_id: string) {
  await http.put(`/evaluations/${evaluation_id}/anonimate`);
}

export async function publishEvaluation(evaluation_id: string) {
  await http.put(`/evaluations/${evaluation_id}/publish`);
}

export async function saveStudentMarks(
  evaluation_id: string,
  {
    private_code,
    studentMarks,
  }: {
    private_code: string;
    studentMarks: { evaluation_has_student_id: string; mark: number }[];
  },
  is_published: boolean
) {
  await http.put(`/evaluations/${evaluation_id}/save`, {
    studentMarks,
    private_code,
    is_published,
  });
}

export async function resetStudentMarks(
  evaluation_id: string,
  private_code: string
) {
  await http.put(`/evaluations/${evaluation_id}/reset-marks`, { private_code });
}
