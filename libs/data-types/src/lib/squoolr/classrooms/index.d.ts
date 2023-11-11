import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type UpdateClassroomPayload = SchemaRequestBody<
  operations,
  'ClassroomsController_updateClassroom'
>;

export type ClassroomEntity = SchemaResponseBody<
  operations,
  'ClassroomsController_getClassrooms'
>[0];
