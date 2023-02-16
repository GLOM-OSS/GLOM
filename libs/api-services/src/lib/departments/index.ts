import { http } from '@squoolr/axios';
import { Department } from '@squoolr/interfaces';

export async function getDepartments(params?: {
  is_deleted?: boolean;
  keywords?: string;
}) {
  const {
    data: { departments },
  } = await http.get<{ departments: Department[] }>(`/departments/all`, {
    params: params,
  });
  return departments;
}

export async function createDepartment(newDepartment: {
  department_name: string;
  department_acronym: string;
}) {
  const {
    data: { department },
  } = await http.post<{ department: Department }>(
    `/departments/new`,
    newDepartment
  );
  return department;
}

export async function editDepartment(
  department_code: string,
  departmentData: { department_name?: string; is_deleted?: boolean }
) {
  await http.put(`/departments/${department_code}/edit`, departmentData);
}
