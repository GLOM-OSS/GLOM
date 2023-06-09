import { useReducer, useContext, Reducer } from 'react';
import { IUser, UserAction } from '@squoolr/interfaces';
import UserContext, { DispatchInterface } from './userContext';

const userReducer: Reducer<IUser & DispatchInterface, UserAction> = (
  state: IUser & DispatchInterface,
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
        preferred_lang: 'fr',
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
  const initialState: IUser & DispatchInterface = {
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
    preferred_lang: 'en',
    annualConfigurator: { annual_configurator_id: 'lsk', is_sudo: false },
    annualRegistry: { annual_registry_id: 'lsk' },
    annualTeacher: {
      annual_teacher_id: 'hstl',
      hourly_rate: 10000,
      has_signed_convention: false,
      teacher_id: 'htsl',
      classroomDivisions: ['Hello', 'Yes'],
    },
    annualStudent: {
      annual_student_id: 'wieo',
      student_id: 'sieosl',
      activeSemesters: [1, 2, 3],
      classroom_code: 'IRT3',
      classroom_level: 3,
    },

    userDispatch: () => null,
  };

  const [userState, userDispatch] = useReducer(userReducer, initialState);
  const value = {
    ...(userState as IUser),
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
