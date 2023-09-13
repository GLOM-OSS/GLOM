import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/root.scss';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/reset.css';
import { GlomThemeProvider } from '@squoolr/theme';

function CustomApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('visibilitychange', function (event) {
      if (document.hidden) {
        setIsDarkMode(
          window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        );
      } else {
        setIsDarkMode(
          window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        );
      }
    });
  }, []);

  return (
    <GlomThemeProvider>
      <Head>
        <title>LYNKR</title>
        <link
          rel="icon"
          type="image/x-icon"
          href={`lynkr_favicon${isDarkMode ? '_light' : ''}.png`}
        />
      </Head>
      <main
        className="app"
        style={{
          padding: '0 16px',
          height: '100vh',
          display: 'grid',
          gridAutoFlow: 'column',
        }}
      >
        <Box sx={{ minWidth: { tablet: '48vw', mobile: '100vw' } }}>
          <Component {...pageProps} />
        </Box>
      </main>
    </GlomThemeProvider>
  );
}

export default CustomApp;
