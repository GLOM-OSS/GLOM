import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

/** ------------- CREATE SCHOOL DEMAND ------------- */
export type SubmitSchoolDemandPayload = SchemaRequestBody<
  operations,
  'SchoolsController_submitDemand'
>;

export type SchoolEntity = SchemaCreateResponseBody<
  operations,
  'SchoolsController_submitDemand'
>;

export type SchoolDemandStatus = SchoolEntity['school_demand_status'];

export type SchoolDemandDetails = SchemaResponseBody<
  operations,
  'SchoolsController_getDemandDetails'
>;

/** ------------- VALIDATE SCHOOL DEMAND ------------- */
export type ValidateSchoolDemandPayload = SchemaRequestBody<
  operations,
  'SchoolsController_validateDemand'
>;

/** ------------- CHANGE SCHOOL DEMAND STATUS TO PROCESSING ------------- */
export type UpdateSchoolStatusPayload = SchemaRequestParams<
  operations,
  'SchoolsController_updateSchoolStatus'
>;

export type SchoolQueryParams = SchemaRequestQuery<
  operations,
  'SchoolsController_getSchools'
>;
export type AnnualSchoolSettings = SchemaResponseBody<
  operations,
  'SchoolsController_getSchoolSettings'
>;

export type DocumentSignerEntity = AnnualSchoolSettings['documentSigners'][0];

export type UpdateSchoolSettingPayload = SchemaRequestBody<
  operations,
  'SchoolsController_updateSchoolSettings'
>;
