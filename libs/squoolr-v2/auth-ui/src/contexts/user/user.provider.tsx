import { useReducer, useContext, Reducer, useEffect } from 'react';
import UserContext, { initialeState } from './user.context';
import { UserAction, UserContextPayload } from './user.interface';
import { useUser } from '@glom/data-access/squoolr';
import { useRouter } from 'next/router';

const userReducer: Reducer<UserContextPayload, UserAction> = (
  state: UserContextPayload,
  action: UserAction
) => {
  switch (action.type) {
    case 'LOAD_USER': {
      return { ...state, data: action.payload };
    }
    case 'UPDATE_ROLES': {
      return { ...state, data: { ...state.data, ...action.payload } };
    }
    case 'CLEAR_USER': {
      return {
        ...state,
        data: initialeState.data,
      };
    }
    default:
      return state;
  }
};

export function UserContextProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [userState, userDispatch] = useReducer(userReducer, initialeState);
  const value = { ...userState, userDispatch };

  const { push } = useRouter();
  const { data, error } = useUser();
  if (error) {
    //TODO toast error here
    push('/signin')
  }
  useEffect(() => {
    if (!userState.data.email && data)
      userDispatch({ type: 'LOAD_USER', payload: data });
  }, [data]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used as a descendant of UserProvider');
  } else return context;
};
