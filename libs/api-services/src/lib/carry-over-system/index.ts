import { http } from '@squoolr/axios';
import { CarryOverSystem } from '@squoolr/interfaces';

export async function getCarryOverSystem() {
  const { data } = await http.get<CarryOverSystem>(`/carry-over-system`);
  return data;
}

export async function updateCarryOverSystem(updateData: CarryOverSystem) {
  await http.put(`/carry-over-system/edit`, {
    carry_over_system: updateData.carry_over_system,
  });
}
