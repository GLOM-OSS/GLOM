import React, { createContext } from 'react';
import { UserAction, IUser } from '@squoolr/interfaces';

export interface DispatchInterface {
  userDispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<IUser & DispatchInterface>({
  activeYear: {
    academic_year_id: '',
    ending_date: new Date('2003-10-12'),
    starting_date: new Date('2022-10-12'),
    code: '',
    year_status: 'active',
  },
  birthdate: new Date('1999/03/27'),
  email: '',
  first_name: '',
  gender: 'Male',
  last_name: '',
  login_id: '',
  national_id_number: '',
  person_id: '',
  phone_number: '',
  preferred_lang: 'en',
  annualStudent: {
    annual_student_id: '',
    student_id: '',
    activeSemesters: [],
    classroom_code: '',
    classroom_level: 0,
  },
  userDispatch: () => null,
});

export default UserContext;
