import { http } from '@squoolr/axios';
import { constants } from '@squoolr/constants';
import {
  Assessment,
  Chapter,
  Course,
  PresenceList,
  Resource,
  Student,
} from '@squoolr/interfaces';

export async function getCourses(semester_number?: number) {
  const { data } = await http.get<Course[]>(`/courses/all`, {
    params: { semester_number },
  });
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
  return data.map((resource) => ({
    ...resource,
    resource_ref:
      resource.resource_type === 'LINK'
        ? resource.resource_ref
        : `${constants.NX_API_BASE_URL}/${resource.resource_ref}`,
  }));
}

export async function getCourseChapters(
  annual_credit_unit_subject_id: string,
  isNotDone?: boolean
) {
  const { data } = await http.get<Chapter[]>(
    `/courses/${annual_credit_unit_subject_id}/chapters`,
    {
      params: { isNotDone },
    }
  );
  return data;
}

export async function getCourseAssessments(
  annual_credit_unit_subject_id: string,
  is_assignment = false
) {
  const { data } = await http.get<Assessment[]>(
    `/courses/${annual_credit_unit_subject_id}/assessments`,
    {
      params: {
        is_assignment,
      },
    }
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
