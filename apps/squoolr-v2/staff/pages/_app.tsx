import { INavSection, SquoolrV2Layout } from '@glom/squoolr-v2/side-nav';
import { GlomThemeProvider } from '@glom/theme';
import building from '@iconify/icons-fluent/building-48-regular';
import dashboard from '@iconify/icons-fluent/grid-28-regular';
import hatGraduation from '@iconify/icons-fluent/hat-graduation-28-regular';
import organization from '@iconify/icons-fluent/organization-48-regular';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/phoneNumberStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';

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
      title: formatMessage({ id: 'configuration' }),
      route: 'configuration',
      navItems: [
        {
          icon: building,
          route: 'departments',
          title: formatMessage({ id: 'departments' }),
        },
        {
          icon: hatGraduation,
          route: 'majors',
          title: formatMessage({ id: 'majors' }),
        },
        {
          icon: organization,
          route: 'academic-years',
          title: formatMessage({ id: 'academicYears' }),
        },
      ],
    },
  ];

  const noLayoutRoutes = ['/signin', '/reset-password', '/new-password'];
  const { asPath } = useRouter();

  const [shouldUseLayout, setShouldUseLayout] = useState<boolean>(false);

  useEffect(() => {
    if (noLayoutRoutes.includes(asPath)) setShouldUseLayout(false);
    else setShouldUseLayout(true);
  }, []);

  if (!shouldUseLayout) return children;
  return (
    <SquoolrV2Layout navSections={navSections} callingApp="Staff">
      {children}
    </SquoolrV2Layout>
  );
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <GlomThemeProvider defaultLang="en">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Head>
          <title>Squoolr Staff</title>
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
