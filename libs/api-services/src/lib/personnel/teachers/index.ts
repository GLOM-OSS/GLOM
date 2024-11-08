import { http } from '@squoolr/axios';
import { Personnel, Teacher } from '@squoolr/interfaces';

export async function getTeachers(params?: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { teachers },
  } = await http.get<{ teachers: Personnel[] }>(`/personnel/teachers/all`, {
    params,
  });
  return teachers;
}

export async function getTeacher(annual_teacher_id: string) {
  const {
    data: { teacher },
  } = await http.get(`/personnel/teachers/${annual_teacher_id}`);
  return teacher;
}

export async function editTeacher(
  annual_teacher_id: string,
  teacherData: Partial<Teacher>
) {
  await http.put(`/personnel/teachers/${annual_teacher_id}/edit`, teacherData);
}

export async function archiveTeacher(annual_teacher_id: string) {
  await http.put(`/personnel/teachers/${annual_teacher_id}/archive`);
}

export async function addNewTeacher(newTeacher: Teacher) {
  const { data } = await http.post<Personnel>(
    `/personnel/teachers/new`,
    newTeacher
  );
  return data;
}

export async function resetTeacherCode(annual_teacher_id: string) {
  await http.put(`/personnel/teachers/${annual_teacher_id}/reset-code`);
}
