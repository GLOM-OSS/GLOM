import { http } from '@squoolr/axios';
import { Teacher } from '../../interfaces';

export async function getTeachers(params: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/teachers/all`, {
    params,
  });
  return personnel;
}

export async function getTeacher(annual_teacher_id: string) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/teachers/${annual_teacher_id}`);
  return personnel;
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
  await http.post(`/personnel/teachers/new`, newTeacher);
}

export async function resetTeacherCode(annual_teacher_id: string) {
  await http.put(`/personnel/teachers/${annual_teacher_id}/reset-code`);
}
