import { Person } from '../interfaces';

export interface Student extends Person {
  annual_student_id: string;
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

export interface ICreatePayment {
  amount: number;
  payment_date: Date;
  transaction_id: string;
  semesterNumbers?: number[];
  payment_reason: 'Platform' | 'Fee' | 'Registration';
}
export interface IPaymentHistory
  extends Omit<ICreatePayment, 'semester_number'> {
  payment_id: string;
  semester_number: number;
}

export interface IFeeSummary {
  total_due: number;
  total_paid: number;
  total_owing: number;
  registration: number;
  paymentHistories: IPaymentHistory[];
}
