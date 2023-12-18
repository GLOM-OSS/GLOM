import { SchemaResponseBody } from '../api-helper';
import { operations } from './docs';

export * from './academic-years';
export * from './ambassadors';
export * from './auth';
export * from './classrooms';
export * from './courses';
export * from './departments';
export * from './inquiries';
export * from './majors';
export * from './payments';
export * from './schools';
export * from './staffs';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettingsEntity = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;

export type TeacherTypeEntity = SchemaResponseBody<
  operations,
  'AppController_getTeacherTypes'
>[0];

export type TeachingGradeEntity = SchemaResponseBody<
  operations,
  'AppController_getTeachingGrades'
>[0];

export type CycleEntity = SchemaResponseBody<
  operations,
  'AppController_getCycles'
>[0];
