import { useReducer, useContext, Reducer } from 'react';
import { User, UserAction } from '../lib/interfaces';
import UserContext, { DispatchInterface } from './userContext';

const userReducer: Reducer<User & DispatchInterface, UserAction> = (
  state: User & DispatchInterface,
  action: UserAction
) => {
  switch (action.type) {
    case 'CLEAR_USER': {
      return {
        ...state,
        activeYear: {
          academic_year_id: '',
          ending_date: new Date(),
          starting_date: new Date(),
          code: '',
          year_status: 'active',
        },
        birthdate: new Date(),
        email: '',
        fisrt_name: '',
        gender: 'Male',
        last_name: '',
        login_id: '',
        national_id_number: '',
        person_id: '',
        phone_number: '',
        preferred_lang: 'Fr',
      };
    }
    case 'LOAD_USER': {
      return { ...state, ...action.payload.user };
    }
    default:
      return state;
  }
};

function UserContextProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const initialState: User & DispatchInterface = {
    // activeYear: {
    //   academic_year_id: '',
    //   ending_date: new Date(),
    //   starting_date: new Date(),
    //   code: '',
    //   year_status: 'active',
    // },
    // birthdate: new Date(),
    // email: '',
    // fisrt_name: '',
    // gender: 'Female',
    // last_name: '',
    // login_id: '',
    // national_id_number: '',
    // person_id: '',
    // phone_number: '',
    // preferred_lang: 'En',
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
    gender: 'Female',
    last_name: 'Kouatchoua',
    login_id: 'disoeosenso',
    national_id_number: '000316122',
    person_id: 'wieo',
    phone_number: '657140183',
    preferred_lang: 'En',
    annualConfigurator: { annual_configurator_id: 'lsk', is_sudo: false },
    annualRegistry: { annual_registry_id: 'lsk' },

    userDispatch: () => null,
  };

  const [userState, userDispatch] = useReducer(userReducer, initialState);
  const value = {
    ...(userState as User),
    userDispatch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used as a descendant of UserProvider');
  } else return context;
};
