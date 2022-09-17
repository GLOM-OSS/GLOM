import { ThemeProvider, CssBaseline } from '@mui/material';
import React from 'react';
import { theme } from './theme';
import { Flip, ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';
import 'react-toastify/dist/ReactToastify.css';
import LanguageContextProvider from './contexts/language/LanguageContextProvider';

export function SquoolrThemeProvider({
  children,
  activeMessages,
  activeLanguage,
}: {
  children: React.ReactNode;
  activeMessages: Record<string, string>;
  activeLanguage: 'En' | 'Fr';
}) {
  return (
    <IntlProvider
      messages={activeMessages}
      locale={activeLanguage}
      defaultLocale="Fr"
    >
      <LanguageContextProvider>
        <ThemeProvider theme={theme}>
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
      </LanguageContextProvider>
    </IntlProvider>
  );
}

export default SquoolrThemeProvider;
