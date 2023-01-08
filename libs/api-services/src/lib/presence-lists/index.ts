import { http } from '@squoolr/axios';
import { CreatePresenceList, PresenceList } from '@squoolr/interfaces';

export async function getAllPresenceLists(presence_list_id: string) {
  const { data } = await http.get<PresenceList[]>(
    `/presence-lists/${presence_list_id}`
  );
  return data;
}

export async function createPresenceList(newPresenceList: CreatePresenceList) {
  const { data } = await http.post<PresenceList>(
    `/presence-lists/new`,
    newPresenceList
  );
  return data;
}

export async function updatePresenceList(
  presence_list_id: string,
  updateData: Partial<CreatePresenceList>
) {
  await http.put(`/presence-lists/${presence_list_id}/edit`, updateData);
}

export async function publishPresenceList(presence_list_id: string) {
  await http.put(`/presence-lists/${presence_list_id}/publish`);
}

export async function deletePresenceList(presence_list_id: string) {
  await http.put(`/presence-lists/${presence_list_id}/delete`);
}
