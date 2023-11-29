import {
  SchemaResponseBody,
  SchemaRequestBody,
  SchemaCreateResponseBody,
  SchemaRequestQuery,
} from '../../api-helper';
import { operations } from '../docs';

export type CreateDepartmentPayload = SchemaRequestBody<
  operations,
  'DepartmentsController_createDepartment'
>;

export type DepartmentEntity = SchemaCreateResponseBody<
  operations,
  'DepartmentsController_createDepartment'
>;

export type UpdateDepartmentPayload = SchemaRequestBody<
  operations,
  'DepartmentsController_updateDepartment'
>;

export type DisableDepartmentsPayload = SchemaRequestQuery<
  operations,
  'DepartmentsController_disableManyDepartments'
>;
