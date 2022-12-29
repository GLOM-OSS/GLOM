import { http } from '@squoolr/axios';
import { AcademicProfile, CreateAcademicProfile } from '@squoolr/interfaces';

export async function getAcademicProfiles() {
  const { data } = await http.get<AcademicProfile[]>(`/academic-profiles/all`);
  return data;
}

export async function getAcademicProfile(annual_academic_profile_id: string) {
  const { data } = await http.get<AcademicProfile>(
    `/academic-profiles/${annual_academic_profile_id}`
  );
  return data;
}

export async function addNewAcademicProfile(
  newAcademicProfile: CreateAcademicProfile
) {
  const { data } = await http.post<AcademicProfile>(
    `/academic-profiles/new`,
    newAcademicProfile
  );
  return data;
}

export async function updateAcademicProfile(
  annual_academic_profile_id: string,
  updateData: Partial<AcademicProfile>
) {
  await http.put(
    `/academic-profiles/${annual_academic_profile_id}/edit`,
    updateData
  );
}

export async function deleteAcademicProfile(
  annual_academic_profile_id: string
) {
  await http.delete(`/academic-profiles/${annual_academic_profile_id}/delete`);
}
