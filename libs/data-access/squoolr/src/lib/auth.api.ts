import { useMutation, useQuery } from '@tanstack/react-query';

import {
    ResetPasswordPayload,
    SetNewPasswordPayload,
    SignInPayload,
} from '@glom/data-types/squoolr';
import squoolrApi from './api';
const { auth } = squoolrApi;

export function useSignIn() {
  return useMutation({
    mutationKey: ['user-singin'],
    mutationFn: (payload: SignInPayload) => auth.signIn(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (payload: ResetPasswordPayload) => auth.resetPassword(payload),
  });
}

export function useSetNewPassword() {
  return useMutation({
    mutationKey: ['set-new-password'],
    mutationFn: (payload: SetNewPasswordPayload) =>
      auth.setNewPassword(payload),
  });
}

export function useUser() {
  return useQuery({
    queryKey: ['get-connected-user-data'],
    queryFn: () => auth.getUser(),
  });
}
