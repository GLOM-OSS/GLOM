import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

/** ------------- CREATE SCHOOL DEMAND ------------- */
export type SubmitSchoolDemandPayload = SchemaRequestBody<
  operations,
  'DemandController_submitDemand'
>;

export type SchoolEntity = SchemaCreateResponseBody<
  operations,
  'DemandController_submitDemand'
>;

export type DemandStatus = SchoolEntity['school_demand_status'];

export type SchoolDemandDetails = SchemaResponseBody<
  operations,
  'DemandController_getDemandDetails'
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
