import { http } from '@squoolr/axios';
import { Classroom } from '../interfaces';

export async function getClassrooms(params?: {
  academic_year_id?: string;
  department_code?: string;
  major_code?: string;
  level?: number;
  is_deleted?: boolean;
}) {
  const {
    data: { classrooms },
  } = await http.get<{ classrooms: Classroom[] }>(`classrooms/all`, {
    params,
  });
  return classrooms;
}

export async function getClassroomDivisions(annual_classroom_id: string) {
  const {
    data: { classroomDivisions },
  } = await http.get(`/classrooms/divisions`, {
    params: { annual_classroom_id },
  });
  return classroomDivisions;
}

export async function editClassroom(
  classroom_code: string,
  classroomData: {
    registration_fee: number;
    total_fee_due: number;
    is_deleted: boolean;
  }
) {
  await http.put(`/classrooms/${classroom_code}/edit`, classroomData);
}
