import { http } from '@squoolr/axios';
import {
  IDiscipline,
  IFeeSummary,
  IPaymentHistory,
  Student,
  StudentDetail,
} from '@squoolr/interfaces';

export async function getStudents(major_code: string, classroom_code?: string) {
  const { data } = await http.get<Student[]>(`/students/all`, {
    params: { major_code, classroom_code },
  });
  return data;
}

export async function getStudentDetails(annual_student_id: string) {
  const { data } = await http.get<StudentDetail>(`/students/details`, {
    params: { annual_student_id },
  });
  return data;
}

export async function getStudentAbsences(annual_student_id?: string) {
  const { data } = await http.get<IDiscipline[]>(`/students/absences`, {
    params: { annual_student_id },
  });
  return data;
}

export async function getStudentFeeSummary(annual_student_id?: string) {
  const { data } = await http.get<IFeeSummary[]>(`/students/fees`, {
    params: { annual_student_id },
  });
  return data;
}

export async function payStudentFee(annual_student_id?: string) {
  const { data } = await http.get<IPaymentHistory>(`/students/pay-fee`, {
    params: { annual_student_id },
  });
  return data;
}

export async function importNewStudents(major_id: string, file: File) {
  const formData = new FormData();
  formData.append('major_id', major_id);
  formData.append('students', file, file.name);
  await http.post(`/student-registrations/imports`, formData);
}
