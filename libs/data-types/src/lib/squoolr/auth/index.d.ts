import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaResponseBody,
} from '../../api-helper';
import { operations } from '../docs';

export type SignInPayload = SchemaRequestBody<
  operations,
  'AuthController_signIn'
>;

export type SingInResponse = SchemaCreateResponseBody<
  operations,
  'AuthController_signIn'
>;

export type ResetPasswordPayload = SchemaRequestBody<
  operations,
  'AuthController_resetPassword'
>;

export type SetNewPasswordPayload = SchemaRequestBody<
  operations,
  'AuthController_setNewPassword'
>;

export type UserEntity = SchemaResponseBody<
  operations,
  'AuthController_getUser'
>;

export type UserRole = UserEntity['roles'][0];
