import { http } from '@squoolr/axios';
import {
  Assessment,
  Chapter,
  Course,
  PresenceList,
  Resource,
  Student
} from '@squoolr/interfaces';

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
  const { data } = await http.get<Resource[]>(
    `/courses/${annual_credit_unit_subject_id}/resources`
  );
  return data;
}

export async function getCourseChapters(annual_credit_unit_subject_id: string) {
  const { data } = await http.get<Chapter[]>(
    `/courses/${annual_credit_unit_subject_id}/chpaters`
  );
  return data;
}

export async function getCourseAssessments(
  annual_credit_unit_subject_id: string
) {
  const { data } = await http.get<Assessment[]>(
    `/courses/${annual_credit_unit_subject_id}/assessments`
  );
  return data;
}

export async function getCourseStudents(annual_credit_unit_subject_id: string) {
  const { data } = await http.get<Student[]>(
    `/courses/${annual_credit_unit_subject_id}/students`
  );
  return data;
}

export async function getPreseneceLists(annual_credit_unit_subject_id: string) {
  const { data } = await http.get<PresenceList[]>(
    `/courses/${annual_credit_unit_subject_id}/presence-lists`
  );
  return data;
}

export * from './chapters';
export * from './resources';