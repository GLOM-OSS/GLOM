import { http } from '@squoolr/axios';
import { Person } from '../../interfaces';

export async function getRegistries(params: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/registries/all`, {
    params,
  });
  return personnel;
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
  await http.post(`/personnel/registries/new`, newRegistry);
}

export async function resetRegistryCode(annual_registry_id: string) {
  await http.put(`/personnel/registries/${annual_registry_id}/reset-code`);
}
