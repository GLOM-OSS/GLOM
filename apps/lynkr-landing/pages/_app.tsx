import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

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
    <>
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
          justifyContent: 'center',
        }}
      >
        <Box sx={{ minWidth: { tablet: '48vw', mobile: '100vw' } }}>
          <Component {...pageProps} />
        </Box>
      </main>
    </>
  );
}

export default CustomApp;
