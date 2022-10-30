import { http } from '@squoolr/axios';

export async function getClassrooms(params: {
  department_code: string;
  major_code: string;
  level: number;
  is_deleted: boolean;
}) {
  await http.get(`classrooms/all`, {
    params,
  });
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
    total_fees_due: number;
    is_deleted: boolean;
  }
) {
  await http.put(`/classrooms/${classroom_code}/edit`, classroomData);
}
