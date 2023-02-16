import { http } from '@squoolr/axios';
import { Person, Personnel } from '@squoolr/interfaces';

export async function getRegistries(params?: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { registries },
  } = await http.get<{ registries: Personnel[] }>(`/personnel/registries/all`, {
    params,
  });
  return registries;
}

export async function getRegistry(annual_registry_id: string) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/registries/${annual_registry_id}`);
  return personnel;
}

export async function archiveRegistry(annual_registry_id: string) {
  await http.put(`/personnel/registries/${annual_registry_id}/archive`);
}

export async function addNewRegistry(newRegistry: Person) {
  const { data } = await http.post<Personnel>(
    `/personnel/registries/new`,
    newRegistry
  );
  return data;
}

export async function resetRegistryCode(annual_registry_id: string) {
  await http.put(`/personnel/registries/${annual_registry_id}/reset-code`);
}
