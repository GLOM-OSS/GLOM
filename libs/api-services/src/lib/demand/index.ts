import { http } from '@squoolr/axios';

export async function getDemands<T>(school_demand_id: string) {
  const {
    data: { school_demands },
  } = await http.get<{ school_demands: T[] }>(`/demands`, {
    params: { school_demand_id },
  });
  return school_demands;
}

export async function getDemandInfo<T>(school_demand_id: string) {
  const {
    data: { school_demand },
  } = await http.get<{ school_demand: T }>(`/demands`, {
    params: { school_demand_id },
  });
  return school_demand;
}

export async function validateDemand(
  school_demand_id: string,
  {
    rejection_reason,
    subdomain,
  }: { rejection_reason?: string; subdomain?: string }
) {
  await http.put(`demands/validate`, {
    school_demand_id,
    rejection_reason,
    subdomain,
  });
}

export async function checkDemandStatus(school_demand_code: string) {
  const {
    data: { demand_status },
  } = await http.get('/demands/status', {
    params: { school_demand_code },
  });
  return demand_status;
}
