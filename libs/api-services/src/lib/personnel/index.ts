import { http } from '@squoolr/axios';
import { Person } from '../interfaces';

export * from './configurators';
export * from './coordinators';
export * from './registries';
export * from './teachers';

export async function resetPersonnelPassword(email: string) {
  await http.put(`/reset-password`, { email });
}

export async function editPersonnel(
  login_id: string,
  personData: Partial<Person>
) {
  await http.put(`/personnel/${login_id}/edit`, personData);
}
