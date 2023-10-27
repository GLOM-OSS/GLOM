import { useRoutes } from 'react-router';
import { routes } from './routes/routes';
import { GlomThemeProvider } from '@glom/theme';

export function App() {
  const routing = useRoutes(routes);

  return <GlomThemeProvider>{routing}</GlomThemeProvider>;
}

export default App;
