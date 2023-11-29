import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../../api-helper';
import { operations } from '../../docs';

export type GradeWeightingEntity = SchemaCreateResponseBody<
  operations,
  'GradeWeightingsController_createGradeWeighting'
>;

export type CreateGradeWeightingPayload = SchemaRequestBody<
  operations,
  'GradeWeightingsController_createGradeWeighting'
>;

export type UpdateGradeWeightingPayload = SchemaRequestBody<
  operations,
  'GradeWeightingsController_updateGradeWeighting'
>;
