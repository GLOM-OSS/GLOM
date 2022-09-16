import React, { createContext } from 'react';
import { UserAction, User } from '../lib/interfaces';

export interface DispatchInterface {
  userDispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<User & DispatchInterface>({
  activeYear: {
    academic_year_id: 'hello world',
    ending_date: new Date('2003-10-12'),
    starting_date: new Date('2022-10-12'),
    code: 'kskdls',
    year_status: 'active',
  },
  birthdate: new Date('1999/03/27'),
  email: 'lorraintchakoumi@gmail.com',
  fisrt_name: 'Tchakoumi Lorrain',
  gender: 'Male',
  last_name: 'Kouatchoua',
  login_id: 'disoeosenso',
  national_id_number: '000316122',
  person_id: 'wieo',
  phone_number: '657140183',
  preferred_lang: 'En',
  annualConfigurator: { annual_configurator_id: 'lsk', is_sudo: false },
  annualRegistry: { annual_registry_id: 'lsk' },
  userDispatch: () => null,
});

export default UserContext;
