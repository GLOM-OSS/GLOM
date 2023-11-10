import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
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

export type BulkDisableStaffPayload = SchemaRequestQuery<
  operations,
  'StaffController_disableManyStaff'
>;

export type BatchUpdatePayload = SchemaResponseBody<
  operations,
  'StaffController_disableManyStaff'
>;

export type UpdateStaffPayload = SchemaRequestBody<
  operations,
  'StaffController_updateStaff'
>;

export type ManaStaffRolesPayload = SchemaRequestBody<
  operations,
  'StaffController_updateStaffRoles'
>;

export type ResetStaffPasswordPayload = SchemaRequestBody<
  operations,
  'StaffController_resetStaffPasswords'
>;
