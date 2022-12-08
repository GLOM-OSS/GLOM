import { http } from '@squoolr/axios';
import { Major } from '../interfaces';

export async function getMajors({
  department_code,
  is_deleted,
}: {
  department_code: string;
  is_deleted?: boolean;
}) {
  const {
    data: { majors },
  } = await http.get<{ majors: Major[] }>(`/majors/all`, {
    params: {
      department_code,
      is_deleted,
    },
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
  await http.post(`/majors/new`, newMajor);
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
