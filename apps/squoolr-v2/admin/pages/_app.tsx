import { GlomThemeProvider } from '@glom/theme';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/phoneNumberStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';
import { INavSection, SquoolrV2Layout } from '@glom/squoolr-v2/side-nav';
import { useIntl } from 'react-intl';
import dashboard from '@iconify/icons-fluent/grid-28-regular';
import demand from '@iconify/icons-fluent/receipt-32-regular';
import schools from '@iconify/icons-fluent/hat-graduation-28-regular';
import configurators from '@iconify/icons-fluent/organization-48-regular';

function App({ children }: { children?: JSX.Element }) {
  const { formatMessage } = useIntl();
  const navSections: INavSection[] = [
    {
      title: formatMessage({ id: 'dashboard' }),
      route: 'dasboard',
      navItems: [
        {
          icon: dashboard,
          route: '',
          title: formatMessage({ id: 'overview' }),
        },
      ],
    },
    {
      title: formatMessage({ id: 'management' }),
      route: 'management',
      navItems: [
        {
          icon: demand,
          route: 'demand',
          title: formatMessage({ id: 'demand' }),
        },
        {
          icon: schools,
          route: 'schools',
          title: formatMessage({ id: 'schools' }),
        },
        {
          icon: configurators,
          route: 'configurators',
          title: formatMessage({ id: 'configurators' }),
        },
      ],
    },
  ];

  return (
    <SquoolrV2Layout navSections={navSections} callingApp="Admin">
      {children}
    </SquoolrV2Layout>
  );
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <GlomThemeProvider defaultLang="en">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Head>
          <title>Squoolr Admin</title>
        </Head>
        <Box
          component="main"
          sx={{
            minHeight: '100vh',
            display: 'grid',
          }}
        >
          <Box
            sx={{
              height: '100%',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <App>
              <Component {...pageProps} />
            </App>
          </Box>
        </Box>
      </LocalizationProvider>
    </GlomThemeProvider>
  );
}

export default CustomApp;
