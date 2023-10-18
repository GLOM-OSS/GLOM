import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
  SchemaResponseBody,
  SchemaRequestQuery,
} from '../api-helper';
import { operations } from './docs';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettings = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;
/** ------------- CREATE SCHOOL DEMAND ------------- */
export type SubmitSchoolDemandPayload = SchemaRequestBody<
  operations,
  'DemandController_submitDemand'
>;

export type SchoolEntity = SchemaCreateResponseBody<
  operations,
  'DemandController_submitDemand'
>;

/** ------------- VALIDATE SCHOOL DEMAND ------------- */
export type ValidateSchoolDemandPayload = SchemaRequestBody<
  operations,
  'DemandController_validateDemand'
>;

/** ------------- UPDATE SCHOOL DEMAND ------------- */
export type ProcessDemandPayload = SchemaRequestParams<
  operations,
  'DemandController_updateDemandStatus'
>;
