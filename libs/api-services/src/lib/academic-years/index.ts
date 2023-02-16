import { http } from '@squoolr/axios';
import { TemplateOptions } from '@squoolr/interfaces';

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

export async function createNewAcademicYear(starts_at: Date, ends_at: Date) {
  const {
    data: { academic_year_id },
  } = await http.post(`/academic-years/new`, { starts_at, ends_at });
  return academic_year_id;
}

export async function templateAcademicYear(
  template_year_id: string,
  templateOptions: TemplateOptions
) {
  const {
    data: { academic_year_id },
  } = await http.post(
    `/academic-years/${template_year_id}/template`,
    templateOptions
  );
  return academic_year_id;
}
