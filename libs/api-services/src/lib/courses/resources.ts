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
  if (chapter_id) formData.append('chapter_id', chapter_id as string);
  formData.append(
    'annual_credit_unit_subject_id',
    annual_credit_unit_subject_id
  );
  for (let i = 0; i < files.length; i++) {
    formData.append('resources', files[i], files[i].name);
  }

  const { data } = await http.post<Resource[]>(
    `/resources/new-files`,
    formData
  );
  return data.map((resource) => ({
    ...resource,
    resource_ref: `${process.env['NX_API_BASE_URL']}/${resource.resource_ref}`,
  }));
}

export async function deleteResource(resource_id: string) {
  await http.delete(`/resources/${resource_id}/delete`);
}

export async function downloadResource(resource_id: string) {
  await http.get(`/resources/${resource_id}/download`);
}
