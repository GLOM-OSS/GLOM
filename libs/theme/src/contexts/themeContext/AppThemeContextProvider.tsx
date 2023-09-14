import { Reducer, useContext, useReducer } from 'react';
import AppThemeContext, {
  Action,
  IAppTheme,
  State,
  AppThemeContextProviderProps,
} from './AppThemeContext';
import { generateTheme } from '../../theme';

const themeReducer: Reducer<IAppTheme, Action> = (
  state: State,
  action: Action
) => {
  return { ...state, theme: action.payload };
};

function AppThemeContextProvider({
  children,
}: AppThemeContextProviderProps): JSX.Element {
  const initialState: IAppTheme = {
    theme: generateTheme(),
    themeDispatch: () => null,
  };

  const [themeState, themeDispatch] = useReducer(themeReducer, initialState);
  const value = {
    theme: themeState.theme,
    themeDispatch: themeDispatch,
  };

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export default AppThemeContextProvider;

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error(
      'useAppTheme must be used as a descendant of ThemeContextProvider'
    );
  } else return context;
};
