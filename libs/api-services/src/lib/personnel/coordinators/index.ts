import { http } from '@squoolr/axios';
import { Personnel } from '@squoolr/interfaces';

export async function getCoordinators(params?: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { coordinators },
  } = await http.get<{ coordinators: Personnel[] }>(`/personnel/coordinators/all`, {
    params,
  });
  return coordinators;
}

export async function getCoordinator(annual_coordinator_id: string) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/coordinators/${annual_coordinator_id}`);
  return personnel;
}

export async function archiveCoordinator(annual_coordinator_id: string) {
  await http.put(`/personnel/coordinators/${annual_coordinator_id}/archive`);
}

export async function addNewCoordinator(
  annual_teacher_id: string,
  classroom_division_ids: string[]
) {
  await http.post(`/personnel/coordinators/new`, {
    annual_teacher_id,
    classroom_division_ids,
  });
}
