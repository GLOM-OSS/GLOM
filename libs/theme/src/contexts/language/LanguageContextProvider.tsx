import { Reducer, useContext, useReducer } from 'react';
import LanguageContext from './languageContext';

import {
  Action, Language,
  LanguageContextProviderProps, State
} from './language.interface';

const languageReducer: Reducer<Language, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case 'USE_ENGLISH': {
      localStorage.setItem('squoolr_active_language', 'en');
      return { ...state, activeLanguage: 'en' };
    }
    case 'USE_FRENCH': {
      localStorage.setItem('squoolr_active_language', 'fr');
      return { ...state, activeLanguage: 'fr' };
    }
    default:
      return state;
  }
};

function LanguageContextProvider({
  children,
}: LanguageContextProviderProps): JSX.Element {
  const initialState: Language = {
    activeLanguage:  'fr',
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
