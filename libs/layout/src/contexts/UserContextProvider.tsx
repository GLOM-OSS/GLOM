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
    annualConfigurator: { annual_configurator_id: 'lsk', is_sudo: false },
    annualRegistry: { annual_registry_id: 'lsk' },
    annualTeacher: {
      annual_teacher_id: 'hstl',
      hourly_rate: 10000,
      has_signed_convention: false,
      teacher_id: 'htsl',
      coordinates: [
        {
          annual_classroom_division_id: 'heisl',
          annual_classroom_id: 'heis',
          classroom_code: 'IRT001',
          classroom_name: 'Informatique Reseaux et Telecoms',
          classroom_short_name: 'IRT',
        },
        {
          annual_classroom_division_id: 'hsisl',
          annual_classroom_id: 'heigs',
          classroom_code: 'IMB001',
          classroom_name: 'Ingenieurie Biomedical',
          classroom_short_name: 'IMB',
        },
        {
          annual_classroom_division_id: 'heisgl',
          annual_classroom_id: 'heiss',
          classroom_code: 'ERGC001',
          classroom_name: 'Energie Renouvelables et Genie Climatique',
          classroom_short_name: 'ERGC',
        },
      ],
    },

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
