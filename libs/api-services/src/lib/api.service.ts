import { http } from '@squoolr/axios';
import { Cycle, Grade } from '@squoolr/interfaces';

export * from './academic-years';
export * from './auth';
export * from './carry-over-system';
export * from './classrooms';
export * from './credit-unit-subjects';
export * from './credit-units';
export * from './demand';
export * from './departments';
export * from './evaluations';
export * from './grade-weightings';
export * from './majors';
export * from './personnel';
export * from './weighting-system';

export async function getCycles() {
  const {
    data: { cycles },
  } = await http.get<{ cycles: Cycle[] }>(`/cycles`);
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
  } = await http.get<{ weightingGrades: Grade[] }>(`/weighting-grades`);
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
