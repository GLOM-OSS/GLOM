import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
  SchemaResponseBody,
  SchemaRequestQuery,
} from '../api-helper';
import { operations } from './docs';

/** ------------- GET SETTINGS ------------- */
export type PlatformSettingsEntity = SchemaResponseBody<
  operations,
  'AppController_getPlatformSettings'
>;

/** ------------- GET AMBASSADOR ------------- */
export type AmbassadorEntity = SchemaResponseBody<
  operations,
  'AmbassadorsController_getAmbassador'
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

/** ------------- CHANGE SCHOOL DEMAND STATUS TO PROCESSING ------------- */
export type ProcessDemandPayload = SchemaRequestParams<
  operations,
  'DemandController_updateDemandStatus'
>;

/** ------------- CREATEE NEW INQUIRY ------------- */
export type CreateInquiryPayload = SchemaRequestBody<
  operations,
  'InquiriesController_createInquiry'
>;

/** ------------- GET ALL INQUIRIES ------------- */
export type InquiryEntity = SchemaCreateResponseBody<
  operations,
  'InquiriesController_createInquiry'
>;
