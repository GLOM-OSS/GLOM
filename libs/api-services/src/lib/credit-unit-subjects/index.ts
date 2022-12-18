import { http } from '@squoolr/axios';
import {
  CreateCreditUnitSubject,
  CreditUnitSubject,
} from '@squoolr/interfaces';

export async function getCreditUnitSubjects(annual_credit_unit_id: string) {
  const { data } = await http.get<CreditUnitSubject[]>(
    `/credit-unit-subjects/${annual_credit_unit_id}all`
  );
  return data;
}

export async function getCreditUnitSubjectDetails(
  credit_unit_subject_id_or_code: string
) {
  const { data } = await http.get<CreditUnitSubject>(
    `/credit-unit-subjects/${credit_unit_subject_id_or_code}`
  );
  return data;
}

export async function addNewCreditUnitSubjects(newCreditUnit: CreateCreditUnitSubject) {
  const { data } = await http.post<CreditUnitSubject>(
    `/credit-unit-subjects/new`,
    newCreditUnit
  );
  return data;
}

export async function updateCreditUnitSubjects(
  annual_credit_unit_subject_id: string,
  newCreditUnit: Partial<CreateCreditUnitSubject>
) {
  await http.put(
    `/credit-unit-subjects/${annual_credit_unit_subject_id}/edit`,
    newCreditUnit
  );
}

export async function deleteCreditUnitSubjects(annual_credit_unit_subject_id: string) {
  await http.delete(
    `/credit-unit-subjects/${annual_credit_unit_subject_id}/delete`
  );
}
