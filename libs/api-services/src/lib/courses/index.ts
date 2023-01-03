import { http } from '@squoolr/axios';
import { Course, Ressource } from '@squoolr/interfaces';

export async function getCourses() {
  const { data } = await http.get<Course[]>(`/courses/all`);
  return data;
}

export async function getCourse(annual_credit_unit_subject_id: string) {
  const { data } = await http.get<Course>(
    `/courses/${annual_credit_unit_subject_id}`
  );
  return data;
}

export async function getCourseResources(
  annual_credit_unit_subject_id: string
) {
  const { data } = await http.get<Ressource[]>(
    `/courses/${annual_credit_unit_subject_id}/resources`
  );
  return data;
}
