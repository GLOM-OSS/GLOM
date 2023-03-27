import { http } from '@squoolr/axios';
import { constants } from '@squoolr/constants';
import {
  ActivateAssessment,
  Assessment,
  AssessmentStatistics,
  IGroupAssignment,
  CreateAssessment,
  Question,
  QuestionAnswer,
  StudentAssessmentAnswer,
  IGroupAssignmentDetails,
  ICorrectedSubmission,
} from '@squoolr/interfaces';

export async function getAssessment(assessment_id: string) {
  const { data } = await http.get<Assessment>(`/assessments/${assessment_id}`);
  return data;
}

export async function createNewAssessment(newAssessment: CreateAssessment) {
  const { data } = await http.post<Assessment>(
    `/assessments/new`,
    newAssessment
  );
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
  annual_evaluation_sub_type_id: string
) {
  const { data } = await http.put(`/assessments/${assessment_id}/publish`, {
    annual_evaluation_sub_type_id,
  });
  return data;
}

export async function getAssessmentQuestions(assessment_id: string) {
  const { data } = await http.get<Question[]>(
    `/assessments/${assessment_id}/questions`
  );
  return data.map((question) => ({
    ...question,
    questionResources: question.questionResources.map((resource) => ({
      ...resource,
      resource_ref: `${constants.NX_API_BASE_URL}/${resource.resource_ref}`,
    })),
  }));
}

export async function getAssessmentSubmissions(assessment_id: string) {
  const { data } = await http.get<
    (StudentAssessmentAnswer | IGroupAssignment)[]
  >(`/assessments/${assessment_id}/submissions`);
  return data;
}

export async function getGroupSumbssionDetails(
  assessment_id: string,
  group_code: string
): Promise<IGroupAssignmentDetails> {
  const {
    data: { answers, ...detalis },
  } = await http.get<IGroupAssignmentDetails>(
    `/assessments/${assessment_id}/${group_code}/details`
  );
  return {
    ...detalis,
    answers: answers.map(({ questionResources, ...answer }) => ({
      ...answer,
      questionResources: questionResources.map((resource) => ({
        ...resource,
        resource_ref: `${process.env['NX_API_BASE_URL']}/${resource.resource_ref}`,
      })),
    })),
  };
}

export async function getStudentAnswers(
  assessment_id: string,
  annual_student_id: string
) {
  const { data } = await http.get<QuestionAnswer[]>(
    `/assessments/${assessment_id}/answers`,
    {
      params: { annual_student_id },
    }
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

export async function submitCorrection(
  assessment_id: string,
  correctedSubmission: ICorrectedSubmission
) {
  const { data } = await http.post(
    `/assessments/${assessment_id}/correct`,
    correctedSubmission
  );
  return data;
}

export * from './questions';
