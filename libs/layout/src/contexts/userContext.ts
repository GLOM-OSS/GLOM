import React, { createContext } from 'react';
import { UserAction, User } from '../lib/interfaces';

export interface DispatchInterface {
  userDispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<User & DispatchInterface>({
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
  preferred_lang: 'En',
  annualConfigurator: { annual_configurator_id: '', is_sudo: false },
  annualRegistry: { annual_registry_id: '' },
  userDispatch: () => null,
});

export default UserContext;
