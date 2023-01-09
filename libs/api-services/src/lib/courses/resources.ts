import { http } from '@squoolr/axios';
import { CreateFile, CreateLink, Resource } from '@squoolr/interfaces';

export async function addNewLinkResource(newLink: CreateLink) {
  const { data } = await http.post<Resource[]>(`/resources/new-link`, newLink);
  return data[0];
}

export async function addNewFileResources({
  files,
  details: { annual_credit_unit_subject_id, chapter_id },
}: CreateFile) {
  const formData = new FormData();
  formData.append('chapter_id', chapter_id);
  formData.append(
    'annual_credit_unit_subject_id',
    annual_credit_unit_subject_id
  );

  Object.keys(files).forEach((key) =>
    formData.append('resources', files[key], files[key].name)
  );
  const { data } = await http.post<Resource[]>(
    `/resources/new-files`,
    formData
  );
  return data;
}

export async function deleteResource(resource_id: string) {
  await http.put(`/resources/${resource_id}/delete`);
}

export async function downloadResource(resource_id: string) {
  await http.get(`/resources/${resource_id}/download`);
}
