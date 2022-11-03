import { http } from '@squoolr/axios';

/**
 * Sign in admin, student or personnel
 * @param email user email
 * @param password user password
 * @returns return user info serialized by the passed type T
 */
export async function signIn<T>(email: string, password: string) {
  const { data } = await http.post<T>(`auth/signin`, {
    email,
    password,
  });
  return data;
}

/**
 * Select an active academic year
 * @param academic_year_id wanted academic yeear id
 * @returns the user context roles
 */
export async function setActiveYear(academic_year_id: string) {
  const { data } = await http.put(`auth/active-roles`, {
    academic_year_id,
  });
  return data;
}

/**
 * Request for password reset
 * @param email email associated to the forgot password
 */
export async function resetPassword(email: string) {
  await http.post(`auth/reset-password`, { email });
}

/**
 * Update your password to the given one
 * @param reset_password_id requested password id. An id is valid once and before expiration time
 * @param new_password new password. Please send the confirmed password instead
 */
export async function setNewPassword(
  reset_password_id: string,
  new_password: string
) {
  await http.post(`auth/new-password`, { reset_password_id, new_password });
}

/**
 * Destroy user session and log him out.
 */
export async function logOut() {
  await http.delete(`auth/log-out`);
}

/**
 * Fetch a connected user data
 * @returns user data and roles: This should be your user context
 */
export async function getUser() {
  const {
    data: { user },
  } = await http.get(`auth/user`);
  return user;
}

/**
 * Sign in with google
 * @returns user context data
 */
export async function googleSignIn() {
  const {
    data: { user },
  } = await http.get(`auth/google-signin`);
  return user;
}
