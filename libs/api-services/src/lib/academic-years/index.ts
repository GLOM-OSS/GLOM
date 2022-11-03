import { http } from '@squoolr/axios';
import { TemplateOptions } from '../interfaces';

/**
 *
 * @returns array of academic years where the connected user has been part
 */
export async function getAcademicYears() {
  const {
    data: { academic_years },
  } = await http.get(`/academic-years/all`);
  return academic_years;
}

export async function createAcademicYear(starts_at: Date, ends_at: Date) {
  await http.post(`/academic-years/new`, { starts_at, ends_at });
}

export async function templateAcademicYear(
  template_year_id: string,
  templateOptions: TemplateOptions
) {
  await http.post(
    `/academic-years/${template_year_id}/template`,
    templateOptions
  );
}
