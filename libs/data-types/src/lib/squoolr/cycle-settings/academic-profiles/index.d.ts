import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../../api-helper';
import { operations } from '../../docs';

export type WeightingSettingsParams = SchemaRequestQuery<
  operations,
  'AcademicProfilesController_getAcademicProfiles'
>;

export type AcademicProfileEntity = SchemaCreateResponseBody<
  operations,
  'AcademicProfilesController_createAcademicProfile'
>;

export type CreateAcademicProfilePayload = SchemaRequestBody<
  operations,
  'AcademicProfilesController_createAcademicProfile'
>;

export type UpdateAcademicProfilePayload = SchemaRequestBody<
  operations,
  'AcademicProfilesController_updateAcademicProfile'
>;
