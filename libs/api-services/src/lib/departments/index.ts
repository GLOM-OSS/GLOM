import { http } from '@squoolr/axios';

export async function getDepartments(is_deleted?: boolean) {
  const {
    data: { departments },
  } = await http.get(`/departments/all`, {
    params: { is_deleted },
  });
  return departments;
}

export async function createDepartment(newDepartment: {
  department_name: string;
  department_acronym: string;
}) {
  await http.post(`/departments/new`, newDepartment);
}

export async function editDepartment(
  department_code: string,
  departmentData: { department_name?: string; is_deleted?: boolean }
) {
  await http.put(`/departments/${department_code}/edit`, departmentData);
}
