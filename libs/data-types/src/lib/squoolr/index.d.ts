import { SchemaResponseBody } from '../api-helper';
import { operations } from './docs';

export * from './ambassadors/index';
export * from './demands/index';
export * from './inquiries/index';
export * from './departments/index';
export * from './classrooms/index';
export * from './majors/index';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettingsEntity = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;
