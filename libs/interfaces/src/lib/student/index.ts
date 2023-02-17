import { Person } from '../interfaces';

export interface Student extends Person {
  annual_student_id: string;
  is_present?: boolean;
  matricule: string;
}

export interface StudentDetail extends Student {
  tutorInfo: Person;
}
