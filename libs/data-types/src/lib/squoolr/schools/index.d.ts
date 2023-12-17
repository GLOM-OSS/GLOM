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
  'SchoolsController_submitSchoolDemand'
>;

export type SchoolEntity = SchemaCreateResponseBody<
  operations,
  'SchoolsController_submitSchoolDemand'
>;

export type SchoolDemandStatus = SchoolEntity['school_demand_status'];

export type SchoolDemandDetails = SchemaResponseBody<
  operations,
  'SchoolsController_getSchoolDetails'
>;

/** ------------- VALIDATE SCHOOL DEMAND ------------- */
export type ValidateSchoolDemandPayload = SchemaRequestBody<
  operations,
  'SchoolsController_validateSchoolDemand'
>;

/** ------------- CHANGE SCHOOL DEMAND STATUS TO PROCESSING ------------- */
export type UpdateSchoolStatusPayload = SchemaRequestParams<
  operations,
  'SchoolsController_updateSchoolStatus'
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
export type SchoolQueryParams = SchemaRequestQuery<
  operations,
  'SchoolsController_getSchools'
>;

export type UpdateSchoolPayload = SchemaRequestBody<
  operations,
  'SchoolsController_updateSchool'
>;

export type SchoolSettingEntity = SchemaResponseBody<
  operations,
  'SchoolsController_getSchoolSettings'
>;

export type UpdateSchoolSettingPayload = SchemaRequestBody<
  operations,
  'SchoolsController_updateSchoolSettings'
>;
