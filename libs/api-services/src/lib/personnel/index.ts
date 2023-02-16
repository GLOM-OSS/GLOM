import { http } from '@squoolr/axios';
import { Person, Personnel } from '@squoolr/interfaces';

export * from '@squoolr/interfaces';
export * from './configurators';
export * from './coordinators';
export * from './registries';
export * from './teachers';

export async function resetPersonnelPassword(email: string) {
  await http.put(`personnel/reset-password`, { email });
}

export async function editPersonnel(
  login_id: string,
  personData: Partial<Person>
) {
  await http.put(`/personnel/${login_id}/edit`, personData);
}

export async function getPersonnel(params?: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { personnel },
  } = await http.get<{ personnel: Personnel[] }>(`/personnel/all`, {
    params,
  });
  return personnel;
}