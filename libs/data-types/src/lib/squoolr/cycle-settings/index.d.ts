import {
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type CycleSettingsParams = SchemaRequestQuery<
  operations,
  'CycleSettingsController_getExamAcessSettings'
>;

export type ExamAcessSettingEntity = SchemaResponseBody<
  operations,
  'CycleSettingsController_getExamAcessSettings'
>[0];

export type UpdateExamAcessSettingPayload = SchemaRequestBody<
  operations,
  'CycleSettingsController_updateExamAcessSettings'
>;

export type EvaluationTypeEntity = SchemaResponseBody<
  operations,
  'CycleSettingsController_getEvaluationTypes'
>[0];

export type UpdateEvaluationTypePayload = SchemaRequestBody<
  operations,
  'CycleSettingsController_updateEvaluationTypes'
>;

export type ModuleSettingEntity = SchemaResponseBody<
  operations,
  'CycleSettingsController_getModuleSettings'
>;

export type UpdateModuleSettingPayload = SchemaRequestBody<
  operations,
  'CycleSettingsController_updateModuleSettings'
>;

export type WeightingSystemEntity = SchemaResponseBody<
  operations,
  'CycleSettingsController_getWeightingSystem'
>;

export type UpdateWeightingSystemPayload = SchemaRequestBody<
  operations,
  'CycleSettingsController_updateWeightingSystem'
>;

export type UpdateMajorSettingsPayload = SchemaRequestBody<
  operations,
  'CycleSettingsController_updateMajorSettings'
>;
