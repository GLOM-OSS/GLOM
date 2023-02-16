import { http } from '@squoolr/axios';
import { Person, School, SchoolDemand } from '@squoolr/interfaces';

export async function getDemands() {
  const {
    data: { school_demands },
  } = await http.get<{ school_demands: SchoolDemand[] }>(`/demands/all`);
  return school_demands;
}

export async function getDemandInfo(school_code: string) {
  const {
    data: { school_demand },
  } = await http.get<{
    school_demand: {
      person: Person;
      school: SchoolDemand;
    };
  }>(`/demands`, {
    params: { school_code },
  });
  return school_demand;
}

export async function validateDemand(
  school_code: string,
  {
    rejection_reason,
    subdomain,
  }: { rejection_reason?: string; subdomain?: string }
) {
  await http.put(`demands/validate`, {
    school_code,
    rejection_reason,
    subdomain,
  });
}

export async function checkDemandStatus(school_demand_code: string) {
  const {
    data: { demand_status },
  } = await http.get(`/demands/status`, {
    params: { school_demand_code },
  });
  return demand_status;
}

export async function makeNewDemand(newDemand: {
  personnel: Person;
  school: School;
}) {
  const {
    data: { school_demand_code },
  } = await http.post(`/demands/new`, newDemand);
  return school_demand_code;
}

export async function editDemandStatus(school_code: string) {
  await http.put(`/demands/${school_code}/status`);
}
