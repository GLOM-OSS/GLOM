import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type CreateMajorPayload = SchemaRequestBody<
  operations,
  'MajorsController_createMajor'
>;

export type MajorEntity = SchemaCreateResponseBody<
  operations,
  'MajorsController_createMajor'
>;
export type CycleEntity = MajorEntity['cycle'];
export type CycleName = CycleEntity['cycle_name'];

export type UpdateMajorPayload = SchemaRequestBody<
  operations,
  'MajorsController_updateMajor'
>;
export type DisableMajorsPayload = SchemaRequestQuery<
  operations,
  'MajorsController_disableMajors'
>;
