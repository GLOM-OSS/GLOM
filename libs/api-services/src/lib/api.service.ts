import { http } from '@squoolr/axios';

export * from './auth';
export * from './demand';
export * from './departments';
export * from './majors';
export * from './classrooms';
export * from './personnel';
export * from './academic-years';
export * from './credit-units';
export * from './credit-unit-subjects';

export async function getCycles() {
  const {
    data: { cycles },
  } = await http.get(`/cycles`);
  return cycles;
}

export async function getTeacherTypes() {
  const {
    data: { teacherTypes },
  } = await http.get(`/teacher-types`);
  return teacherTypes;
}

export async function getTeachingGrades() {
  const {
    data: { teacherGrades },
  } = await http.get(`/teaching-grades`);
  return teacherGrades;
}

export async function getWeightingGrades() {
  const {
    data: { weightingGrades },
  } = await http.get(`/weighting-grades`);
  return weightingGrades;
}

export async function getEvaluationTypes() {
  const {
    data: { evaluationTypes },
  } = await http.get(`/evaluation-types`);
  return evaluationTypes;
}

export async function getSubjectParts() {
  const {
    data: { subjectParts },
  } = await http.get(`/subject-parts`);
  return subjectParts;
}
export function apiServices(): string {
  return 'api-services';
}
