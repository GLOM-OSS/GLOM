import { http } from '@squoolr/axios';

export async function signIn<T>(email: string, password: string) {
  const { data } = await http.post<T>(`auth/signin`, {
    email,
    password,
  });
  return data;
}

export async function setActiveYear(academic_year_id: string) {
  const { data } = await http.patch(`auth/active-year`, {
    academic_year_id,
  });
  return data;
}

export async function resetPassword(email: string) {
  return http.post(`auth/reset-password`, { email });
}

export async function setNewPassword(
  reset_password_id: string,
  new_password: string
) {
  return http.post(`auth/new-password`, { reset_password_id, new_password });
}

export async function logOut() {
  return await http.delete(`auth/log-out`);
}

export async function getUser() {
  const {
    data: { user },
  } = await http.get(`auth/user`);
  return user;
}

export async function googleSignIn() {
  const {
    data: { user },
  } = await http.get(`auth/google-signin`);
  return user;
}
