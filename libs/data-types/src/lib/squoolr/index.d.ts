import { SchemaResponseBody } from '../api-helper';
import { operations } from './docs';

export * from './ambassadors/index';
export * from './classrooms/index';
export * from './demands/index';
export * from './departments/index';
export * from './inquiries/index';
export * from './majors/index';
export * from './staffs/index';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettingsEntity = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;
