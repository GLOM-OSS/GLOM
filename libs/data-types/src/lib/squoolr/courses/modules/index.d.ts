import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../../api-helper';
import { operations } from '../../docs';

export type ModuleEntity = SchemaCreateResponseBody<
  operations,
  'CourseModulesController_createCourseModule'
>;

export type CreateModulePaylaod = SchemaRequestBody<
  operations,
  'CourseModulesController_createCourseModule'
>;

export type QueryModuleParams = SchemaRequestQuery<
  operations,
  'CourseModulesController_getCourseModules'
>;

export type UpdateModulePayload = SchemaRequestBody<
  operations,
  'CourseModulesController_updateModule'
>;

export type DisableManyModulePayload = SchemaRequestQuery<
  operations,
  'CourseModulesController_disableManyModules'
>;
