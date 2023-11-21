import { SchemaResponseBody } from '../api-helper';
import { operations } from './docs';

export * from './academic-years';
export * from './ambassadors';
export * from './auth';
export * from './classrooms';
export * from './schools';
export * from './departments';
export * from './inquiries';
export * from './majors';
export * from './staffs';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettingsEntity = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;

export type TeacherTypeEntity = SchemaResponseBody<
  operations,
  'AppController_getTeacherTypes'
>;

export type TeachingGradeEntity = SchemaResponseBody<
  operations,
  'AppController_getTeachingGrades'
>;
