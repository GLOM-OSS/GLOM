import { http } from '@squoolr/axios';
import {
  CreateWeightingSystem,
  EvaluationTypeWeighting,
} from '@squoolr/interfaces';

export async function getWeightingSystem() {
  const { data } = await http.get<CreateWeightingSystem>(`/weighting-system`);
  return data;
}

export async function updateWeightingSystem(
  newWeightingSystem: CreateWeightingSystem
) {
  await http.put(`/weighting-system/upsert`, newWeightingSystem);
}

export async function getEvaluationTypeWeighting(cycle_id: string) {
  const { data } = await http.get<EvaluationTypeWeighting>(
    `/weighting-system/evaluation-type/${cycle_id}`
  );
  return data;
}

export async function updateEvaluationTypeWeighting(
  cycle_id: string,
  updateData: EvaluationTypeWeighting
) {
  await http.put(
    `/weighting-system/evaluation-type/${cycle_id}/upsert`,
    updateData
  );
}

