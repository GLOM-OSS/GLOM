import { ThemeProvider, CssBaseline } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React from 'react';
import { theme } from './theme';
import { Flip, ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';
import 'react-toastify/dist/ReactToastify.css';
import LanguageContextProvider, {
  useLanguage,
} from './contexts/language/LanguageContextProvider';
import frMessages from './languages/fr';
import enMessages from './languages/en-us';

const App = ({
  children,
  newTheme,
}: {
  children: React.ReactNode;
  newTheme?: Theme;
}) => {
  const { activeLanguage } = useLanguage();
  const activeMessages = activeLanguage === 'fr' ? frMessages : enMessages;
  return (
    <IntlProvider
      messages={activeMessages}
      locale={activeLanguage}
      defaultLocale="fr"
    >
      <ThemeProvider theme={newTheme ?? theme}>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          transition={Flip}
        />
        <CssBaseline />
        {children}
      </ThemeProvider>
    </IntlProvider>
  );
};

/**
 *
 * @param {Theme} theme - the new theme to overright the base GLOM theme
 * @param {React.ReactNode} children - children that'll consume the provided theme
 * @returns {JSX.Element}
 */
export function GlomThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  return (
    <LanguageContextProvider>
      <App newTheme={theme}>{children}</App>
    </LanguageContextProvider>
  );
}

export default GlomThemeProvider;
