import { http } from '@squoolr/axios';
import { Person } from '../../interfaces';

export async function getConfigurators(params: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/configurators/all`, {
    params,
  });
  return personnel;
}

export async function getConfigurator(annual_configurator_id: string) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/configurators/${annual_configurator_id}`);
  return personnel;
}

export async function archiveConfigurators(annual_coordinator_id: string) {
  await http.put(`/personnel/configurators/${annual_coordinator_id}/archive`);
}

export async function addNewConfigurator(newConfigurator: Person) {
  await http.post(`/personnel/configurators/new`, newConfigurator);
}