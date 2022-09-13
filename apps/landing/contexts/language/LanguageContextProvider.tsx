import { useReducer, useContext, Reducer } from 'react';
import LanguageContext from './languageContext';

import {
  Action,
  State,
  Language,
  LanguageContextProviderProps,
  LanguageType,
} from './language.interface';

const languageReducer: Reducer<Language, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case 'USE_ENGLISH': {
      localStorage.setItem('squoolr_active_language', 'En');
      return { ...state, activeLanguage: 'En' };
    }
    case 'USE_FRENCH': {
      localStorage.setItem('squoolr_active_language', 'Fr');
      return { ...state, activeLanguage: 'Fr' };
    }
    default:
      return state;
  }
};

function LanguageContextProvider({
  children,
}: LanguageContextProviderProps): JSX.Element {
  const initialState: Language = {
    activeLanguage: localStorage.getItem('squoolr_active_language') as LanguageType || 'Fr',
    languageDispatch: () => null,
  };

  const [languageState, languageDispatch] = useReducer(
    languageReducer,
    initialState
  );
  const value = {
    activeLanguage: languageState.activeLanguage,
    languageDispatch,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContextProvider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      'useLanguage must be used as a descendant of LanguageProvider'
    );
  } else return context;
};
