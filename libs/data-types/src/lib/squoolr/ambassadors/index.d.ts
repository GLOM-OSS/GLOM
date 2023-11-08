import { SchemaResponseBody } from '../../api-helper';
import { operations } from '../docs';

/** ------------- GET AMBASSADOR ------------- */
export type AmbassadorEntity = SchemaResponseBody<
  operations,
  'AmbassadorsController_getAmbassador'
>;
