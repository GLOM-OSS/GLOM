import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type CreateStaffPayload = SchemaRequestBody<
  operations,
  'StaffController_createStaff'
>;

export type UpdateStaffPayload = SchemaRequestBody<
  operations,
  'StaffController_updateStaff'
>;

export type StaffEntity = SchemaCreateResponseBody<
  operations,
  'StaffController_createStaff'
>;
