import { Person } from '../interfaces';

export interface Student extends Person {
  annual_student_id: string;
  is_present?: boolean;
  matricule: string;
  classroom_acronym: string;
  is_active: boolean;
}

export interface StudentDetail extends Student {
  tutorInfo: Person;
}

export interface IDiscipline {
  presence_list_date: Date;
  subject_title: string;
  absences: number;
}

export interface IPaymentHistory {
  amount: number;
  payment_date: Date;
  payment_reason: 'Platform' | 'Fee' | 'Registration';
}

export interface IFeeSummary {
  total_due: number;
  total_paid: number;
  total_owing: number;
  paymentHistories: IPaymentHistory[];
}
