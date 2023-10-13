import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box } from '@mui/material';
import { GlomThemeProvider } from '@glom/theme';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <GlomThemeProvider defaultLang="en">
      <Head>
        <title>Squoolr</title>
      </Head>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'grid',
          backgroundColor: '#FAFAFD',
        }}
      >
        <Box>
          <Component {...pageProps} />
        </Box>
      </Box>
    </GlomThemeProvider>
  );
}

export default CustomApp;
