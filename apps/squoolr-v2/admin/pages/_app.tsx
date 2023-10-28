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
            <Component {...pageProps} />
          </Box>
        </Box>
      </LocalizationProvider>
    </GlomThemeProvider>
  );
}

export default CustomApp;
