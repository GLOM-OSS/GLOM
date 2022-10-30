import { http } from '@squoolr/axios';

export async function getMajors({
  department_code,
  is_deleted,
}: {
  department_code: string;
  is_deleted: boolean;
}) {
  const {
    data: { majors },
  } = await http.get(`/majors/all`, {
    params: {
      department_code,
      is_deleted,
    },
  });
  return majors;
}

export async function createMajor(newMajor: {
  department_code: string;
  major_name: string;
  major_acronym: string;
  cycle_id: string;
  classrooms: string[];
}) {
  await http.post(`/majors/new`, {
    newMajor,
  });
}

export async function editMajor(
  major_code: string,
  majorData: {
    major_name?: string;
    major_acronym?: string;
    department_code?: string;
    is_deleted?: boolean;
  }
) {
  await http.put(`/majors/${major_code}/edit`, majorData);
}