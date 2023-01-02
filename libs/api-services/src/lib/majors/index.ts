import { http } from '@squoolr/axios';
import { Major } from '../interfaces';

export async function getMajors(params?: {
  department_code?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { majors },
  } = await http.get<{ majors: Major[] }>(`/majors/all`, {
    params,
  });
  return majors;
}

export async function getMajorDetails(major_code: string) {
  const {
    data: { major },
  } = await http.get(`/majors/${major_code}`);
  return major;
}

export async function createMajor(newMajor: {
  department_code: string;
  major_name: string;
  major_acronym: string;
  cycle_id: string;
  classrooms: {
    level: number;
    total_fee_due: number;
    registration_fee: number;
  }[];
}) {
  const {
    data: { major },
  } = await http.post<{ major: Major }>(`/majors/new`, newMajor);
  return major;
}

export async function editMajor(
  major_code: string,
  majorData: {
    major_name?: string;
    major_acronym?: string;
    department_code?: string;
    is_deleted?: boolean;
    classrooms?: {
      level: number;
      total_fee_due: number;
      registration_fee: number;
    }[];
  }
) {
  await http.put(`/majors/${major_code}/edit`, majorData);
}
