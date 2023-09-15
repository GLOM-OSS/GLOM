import { Box } from '@mui/material';
import { GlomThemeProvider } from '@squoolr/theme';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  function updateWindowMode() {
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
  }
  useEffect(() => {
    updateWindowMode();
    document.addEventListener('visibilitychange', updateWindowMode);
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
          height: '100vh',
          display: 'grid',
          gridAutoFlow: 'column',
        }}
      >
        <Box>
          <Component {...pageProps} />
        </Box>
      </main>
    </GlomThemeProvider>
  );
}

export default CustomApp;
