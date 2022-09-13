import { useLanguage } from './contexts/language/LanguageContextProvider';
import frMessages from './languages/fr';
import enMessages from './languages/en-us';
import { useRoutes } from 'react-router';
import { routes } from './routes/routes';
import { SquoolrThemeProvider } from '@squoolr/theme';

export function App() {
  const { activeLanguage } = useLanguage();
  const activeMessage = activeLanguage === 'En' ? frMessages : enMessages;
  const routing = useRoutes(routes);

  return (
    <SquoolrThemeProvider
      activeLanguage={activeLanguage}
      activeMessages={activeMessage}
    >
      {routing}
    </SquoolrThemeProvider>
  );
}

export default App;
