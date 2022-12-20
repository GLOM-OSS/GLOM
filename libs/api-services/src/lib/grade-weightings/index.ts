import { http } from '@squoolr/axios';
import { CreateGradeWeighting, GradeWeighting } from '@squoolr/interfaces';

export async function getGradeWeightings() {
  const { data } = await http.get<GradeWeighting[]>(`grade-weightings/all`);
  return data;
}

export async function getGradeWeighting(annnual_grade_weighting_id: string) {
  const { data } = await http.get<GradeWeighting>(
    `grade-weightings/${annnual_grade_weighting_id}`
  );
  return data;
}

export async function addNewGradeWeighting(
  newGradeWeighting: CreateGradeWeighting
) {
  const { data } = await http.post<GradeWeighting>(
    `grade-weightings/new`,
    newGradeWeighting
  );
  return data;
}

export async function updateGradeWeighting(
  annnual_grade_weighting_id: string,
  updateData: Partial<GradeWeighting>
) {
  await http.put(
    `/grade-weightings/${annnual_grade_weighting_id}/edit`,
    updateData
  );
}

export async function deleteGradeWeighting(annnual_grade_weighting_id: string) {
  await http.delete(`/grade-weightings/${annnual_grade_weighting_id}/delete`);
}