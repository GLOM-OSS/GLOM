import { http } from '@squoolr/axios';
import { SemesterExamAccess } from '@squoolr/interfaces';

export async function getExamAccess() {
  const { data } = await http.get<SemesterExamAccess[]>(
    `/hall-accesses/all`
  );
  return data;
}

export async function updateExamAcess(updateData: SemesterExamAccess[]) {
  await http.put(`/hall-accesses/edit`, {
    semesterExamAccesses: updateData,
  });
}
