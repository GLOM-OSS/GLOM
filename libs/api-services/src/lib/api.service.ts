import { http } from '@squoolr/axios';
import { Cycle, Grade } from '@squoolr/interfaces';

export * from './academic-profiles';
export * from './academic-years';
export * from './assessments';
export * from './auth';
export * from './carry-over-system';
export * from './classrooms';
export * from './courses';
export * from './credit-unit-subjects';
export * from './credit-units';
export * from './demand';
export * from './departments';
export * from './evaluations';
export * from './grade-weightings';
export * from './hall-accesses';
export * from './majors';
export * from './personnel';
export * from './presence-lists';
export * from './students';
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
    data: { teachingGrades },
  } = await http.get(`/teaching-grades`);
  return teachingGrades;
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
  } = await http.get<{
    subjectParts: {
      subject_part_id: string;
      subject_part_name: 'GUIDED_WORK' | 'PRACTICAL' | 'THEORY';
    }[];
  }>(`/subject-parts`);
  return subjectParts;
}
export function apiServices(): string {
  return 'api-services';
}
