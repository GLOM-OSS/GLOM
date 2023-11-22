import { SchemaCreateResponseBody, SchemaRequestBody } from '../../api-helper';
import { operations } from '../docs';

export type CreateMajorPayload = SchemaRequestBody<
  operations,
  'MajorsController_createMajor'
>;

export type MajorEntity = SchemaCreateResponseBody<
  operations,
  'MajorsController_createMajor'
>;

export type UpdateMajorPayload = SchemaRequestBody<
  operations,
  'MajorsController_updateMajor'
>;
