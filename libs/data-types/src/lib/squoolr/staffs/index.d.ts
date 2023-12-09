import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../api-helper';
import { components, operations } from '../docs';

export type CreateStaffPayload = SchemaRequestBody<
  operations,
  'StaffController_createStaff'
>;

export type UpdateStaffPayload = SchemaRequestBody<
  operations,
  'StaffController_updateStaff'
>;

export type StaffEntity = SchemaResponseBody<
  operations,
  'StaffController_getStaffs'
>[0];

export type TeacherEntity = components['schemas']['TeacherEntity'];
export type CoordinatorEntity = components['schemas']['CoordinatorEntity'];

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

export type ManageStaffRolesPayload = SchemaRequestBody<
  operations,
  'StaffController_updateStaffRoles'
>;

export type ResetStaffPasswordPayload = SchemaRequestBody<
  operations,
  'StaffController_resetStaffPasswords'
>;

export type StaffQueryParams = SchemaRequestQuery<
  operations,
  'StaffController_getStaffs'
>;
export type StaffRole = SchemaRequestQuery<
  operations,
  'StaffController_getStaff'
>['role'];
