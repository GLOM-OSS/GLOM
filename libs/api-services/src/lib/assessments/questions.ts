import { http } from '@squoolr/axios';
import {
  CreateQuestion,
  EditQuestionInterface,
  Question,
  QuestionResource,
} from '@squoolr/interfaces';

export async function getQuestion(question_id: string) {
  const { data } = await http.get<Question>(
    `/assessments/questions/${question_id}`
  );
  return {
    ...data,
    questionResources: data.questionResources.map((resource) => ({
      ...resource,
      resource_ref: `${process.env['NX_API_BASE_URL']}/${resource.resource_ref}`,
    })),
  };
}

export async function createNewQuestion(
  newQuestion: CreateQuestion,
  files: File[]
) {
  const { data } = await http.post<
    Omit<Question, 'questionResources' | 'questionOptions'>
  >(`/assessments/questions/new`, newQuestion);

  if (files.length === 0) return { ...data, questionResources: [] };
  const formData = new FormData();
  for (const key in files) {
    formData.append('questionResources', files[key], files[key].name);
  }
  const { data: questionResources } = await http.post<QuestionResource[]>(
    `/assessments/questions/${data.question_id}/new-resources`,
    formData
  );
  return {
    ...data,
    questionResources: questionResources.map((resource) => ({
      ...resource,
      resource_ref: `${process.env['NX_API_BASE_URL']}/${resource.resource_ref}`,
    })),
  };
}

export async function updateQuestion(
  question_id: string,
  updateQuestion: EditQuestionInterface,
  files: File[]
) {
  await http.put(`/assessments/questions/${question_id}/edit`, updateQuestion);
  if (files.length > 0) {
    const formData = new FormData();
    for (const key in files) {
      formData.append('questionResources', files[key], files[key].name);
    }
    await http.post<QuestionResource>(
      `/assessments/questions/${question_id}/new-resources`,
      formData
    );
  }
}

export async function deleteQuestion(question_id: string) {
  await http.put(`/assessments/questions/${question_id}/delete`);
}
