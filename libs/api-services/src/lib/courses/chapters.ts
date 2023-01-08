import { http } from '@squoolr/axios';
import {
  Assessment,
  Chapter,
  CreateChapter,
  Resource,
} from '@squoolr/interfaces';

export async function getChapter(chapter_id: string) {
  const { data } = await http.get<Chapter>(`/chapters/${chapter_id}`);
  return data;
}

export async function getChapterParts(chapter_id: string) {
  const { data } = await http.get<Chapter[]>(`/chapters/${chapter_id}/parts`);
  return data;
}

export async function getChapterResources(chapter_id: string) {
  const { data } = await http.get<Resource[]>(
    `/chapters/${chapter_id}/resources`
  );
  return data;
}

export async function getChapterAssessment(chapter_id: string) {
  const { data } = await http.get<Assessment>(
    `/chapters/${chapter_id}/assessment`
  );
  return data;
}

export async function createNewChapter(newChapter: CreateChapter) {
  const { data } = await http.post<Chapter>(`/chapters/new`, newChapter);
  return data;
}

export async function updateChapter(
  chapter_id: string,
  updateData: Partial<Chapter>
) {
  await http.put(`/chapters/${chapter_id}/edit`, updateData);
}

export async function deleteChapter(chapter_id: string) {
  await http.put(`/chapters/${chapter_id}/delete`);
}
