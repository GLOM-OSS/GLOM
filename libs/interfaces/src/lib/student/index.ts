import { Person } from '../interfaces';

export interface Student extends Person {
  annual_student_id: string;
  is_present?: boolean;
  matricule: string;
  classroom_acronym: string;
  is_active: boolean;
  preferred_lang: 'fr' | 'en';
}

export interface StudentDetail extends Student {
  tutorInfo: Person;
}
