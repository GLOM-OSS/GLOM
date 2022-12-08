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
          ending_date: new Date('2003-10-12'),
          starting_date: new Date('2022-10-12'),
          code: '',
          year_status: 'active',
        },
        birthdate: new Date('2001/09/03'),
        email: '',
        first_name: '',
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
    activeYear: {
      academic_year_id: '',
      ending_date: new Date('2003-10-12'),
      starting_date: new Date('2022-10-12'),
      code: '',
      year_status: 'active',
    },
    birthdate: new Date('2001/09/03'),
    email: '',
    first_name: '',
    gender: 'Female',
    last_name: '',
    login_id: '',
    national_id_number: '',
    person_id: '',
    phone_number: '',
    preferred_lang: 'En',
    annualConfigurator: { annual_configurator_id: '', is_sudo: false },
    annualRegistry: { annual_registry_id: '' },

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
