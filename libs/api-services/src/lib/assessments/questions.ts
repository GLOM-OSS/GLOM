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
  return data;
}

export async function createNewQuestion(
  newQuestion: CreateQuestion,
  files?: FileList
) {
  const { data } = await http.post<
    Omit<Question, 'questionResources' | 'questionOptions'>
  >(`/assessments/questions/new`, newQuestion);

  if (!files) return data;
  const formData = new FormData();
  Object.keys(files).forEach((key) =>
    formData.append('questionResources', files[key], files[key].name)
  );
  const { data: questionResources } = await http.post<QuestionResource>(
    `/assessments/questions/${data.question_id}/new-resources`,
    formData
  );
  return { ...data, questionResources };
}

export async function updateQuestion(
  question_id: string,
  updateQuestion: EditQuestionInterface,
  files?: FileList
) {
  await http.put(`/assessments/questions/${question_id}/edit`, updateQuestion);
  if (files) {
    const formData = new FormData();
    Object.keys(files).forEach((key) =>
      formData.append('questionResources', files[key], files[key].name)
    );
    await http.post<QuestionResource>(
      `/assessments/questions/${question_id}/new-resources`,
      formData
    );
  }
}
