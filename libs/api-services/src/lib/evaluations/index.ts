import { http } from '@squoolr/axios';
import { SemesterExamAccess } from '@squoolr/interfaces';

export async function getExamAccess() {
  const { data } = await http.get<SemesterExamAccess[]>(
    `/evaluations/hall-access`
  );
  return data;
}

export async function updateExamAcess(updateData: SemesterExamAccess[]) {
  await http.put(`/evaluations/hall-access`, {
    semesterExamAccesses: updateData,
  });
}
