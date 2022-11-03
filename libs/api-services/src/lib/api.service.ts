import { http } from '@squoolr/axios';

export * from './auth';
export * from './demand';
export * from './departments';
export * from './majors';
export * from './classrooms';
export * from './personnel';
export * from './academic-years';

export async function getCycles() {
  const {
    data: { cycles },
  } = await http.get(`/cycles`);
  return cycles;
}

export async function getTeacherTypes() {
  const {
    data: { teacher_types },
  } = await http.get(`/teacher-types`);
  return teacher_types;
}

export async function getTeacherGrades() {
  const {
    data: { teacher_grades },
  } = await http.get(`/teacher-grades`);
  return teacher_grades;
}
export function apiServices(): string {
  return 'api-services';
}
