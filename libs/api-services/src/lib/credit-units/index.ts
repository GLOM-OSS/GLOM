import { http } from '@squoolr/axios';
import {
  CreateCreditUnit,
  CreditUnit,
  CreditUnitMarkStatus,
  UEMajor,
} from '@squoolr/interfaces';

export async function getCreditUnits(params?: {
  majorIds?: { major_id: string }[];
  semester_number?: number;
}) {
  const { data } = await http.get<CreditUnit[]>(`/credit-units/all`, {
    params,
  });
  return data;
}

export async function getCreditUnitDetails(credit_unit_id_or_code: string) {
  const { data } = await http.get<CreditUnit>(
    `/credit-units/${credit_unit_id_or_code}`
  );
  return data;
}

export async function addNewCreditUnit(newCreditUnit: CreateCreditUnit) {
  const { data } = await http.post<CreditUnit>(
    `/credit-units/new`,
    newCreditUnit
  );
  return data;
}

export async function updateCreditUnit(
  annual_credit_unit_id: string,
  newCreditUnit: Partial<CreateCreditUnit>
) {
  await http.put(`/credit-units/${annual_credit_unit_id}/edit`, newCreditUnit);
}

export async function deleteCreditUnit(annual_credit_unit_id: string) {
  await http.delete(`/credit-units/${annual_credit_unit_id}/delete`);
}

export async function getCoordinatorMajors() {
  const { data } = await http.get<UEMajor[]>(`/credit-units/majors`);
  return data;
}

export async function getCreditUnitMarkStatus(params: {
  major_code?: string;
  smester_number?: number;
  annual_credit_unit_id?: string;
  annual_credit_unit_subject_id?: string;
}) {
  const { data } = await http.get<CreditUnitMarkStatus[]>(
    `credit-units/mark-status`,
    { params }
  );
  return data;
}

export async function publishCreditUnit(annual_credit_unit_id: string) {
  await http.put(`/credit-units/${annual_credit_unit_id}/publish`);
}
