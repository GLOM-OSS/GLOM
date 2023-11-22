import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type CreateAcademicYearPayload = SchemaRequestBody<
  operations,
  'AcademicYearsController_createAcademicYear'
>;
export type AcademicYearEntity = SchemaCreateResponseBody<
  operations,
  'AcademicYearsController_createAcademicYear'
>;

export type UserAnnualRoles = SchemaResponseBody<
  operations,
  'AcademicYearsController_chooseActiveAcademicYear'
>;
