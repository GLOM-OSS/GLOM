import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestQuery,
  SchemaResponseBody,
} from '../../../api-helper';
import { operations } from '../../docs';

export type SubjectEntity = SchemaCreateResponseBody<
  operations,
  'CourseSubjectsController_createSubject'
>;

export type CreateSubjectPaylaod = SchemaRequestBody<
  operations,
  'CourseSubjectsController_createSubject'
>;

export type QuerySubjectParams = SchemaRequestQuery<
  operations,
  'CourseSubjectsController_getSubjects'
>;

export type UpdateSubjectPayload = SchemaRequestBody<
  operations,
  'CourseSubjectsController_updateSubject'
>;

export type DisableManySubjectPayload = SchemaRequestQuery<
  operations,
  'CourseSubjectsController_disableManySubjects'
>;
