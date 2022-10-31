import { http } from '@squoolr/axios';

export async function getCoordinators(params: {
  keywords?: string;
  is_deleted?: boolean;
}) {
  const {
    data: { personnel },
  } = await http.get(`/personnel/coordinators/all`, {
    params,
  });
  return personnel;
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
