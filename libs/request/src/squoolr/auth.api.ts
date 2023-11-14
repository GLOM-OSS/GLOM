import {
  ResetPasswordPayload,
  SetNewPasswordPayload,
  SignInPayload,
  SingInResponse,
  UserEntity,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class AuthApi {
  constructor(private readonly request: GlomRequest) {}

  async signIn(payload: SignInPayload) {
    const resp = await this.request.post<SingInResponse>(
      '/auth/signin',
      payload
    );
    return resp.data;
  }

  async resetPassword(payload: ResetPasswordPayload) {
    await this.request.post('/auth/reset-password', payload);
  }

  async setNewPassword(payload: SetNewPasswordPayload) {
    await this.request.post<never>('/auth/new-password', payload);
  }

  async getUser() {
    const resp = await this.request.get<UserEntity>('/auth/user');
    return resp.data;
  }
}
