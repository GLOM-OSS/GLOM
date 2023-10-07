import { useRoutes } from 'react-router';
import { routes } from './routes/routes';
import { SquoolrThemeProvider } from '@glom/theme';

export function App() {
  const routing = useRoutes(routes);

  return <SquoolrThemeProvider>{routing}</SquoolrThemeProvider>;
}

export default App;
