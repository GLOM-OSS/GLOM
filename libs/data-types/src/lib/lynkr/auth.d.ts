import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
} from '../api-helper';
import { operations } from './docs';

/** ------------- SING IN ------------- */
export type SignInPayload = SchemaRequestBody<
  operations,
  'GlomAuthController_signIn'
>;
export type SignInResponseBody = SchemaCreateResponseBody<
  operations,
  'GlomAuthController_signIn'
>;

/** ------------- SING UP ------------- */
export type SignUpPayload = SchemaRequestBody<
  operations,
  'GlomAuthController_signUp'
>;
export type SignUpResponseBody = SchemaCreateResponseBody<
  operations,
  'GlomAuthController_signUp'
>;

/** ------------- RESET PASSWORD ------------- */
export type ResetPasswordPayload = SchemaRequestBody<
  operations,
  'GlomAuthController_resetPassword'
>;

/** ------------- CANCEL RESET PASSWORD REQUEST ------------- */
export type SetNewPasswordPayload = SchemaRequestParams<
  operations,
  'GlomAuthController_cancelResetPasswordRequest'
>;
