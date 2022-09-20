import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import createEmotionCache from '../config_mui/createEmotionCache';
import './globalStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import { SquoolrThemeProvider, useLanguage } from '@squoolr/theme';
import { Box } from '@mui/material';

const App = (props) => {
  const { Component, pageProps } = props;
  const { languageDispatch } = useLanguage();
  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('squoolr_active_language') === 'En'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Box>Hello world</Box>
      <Component {...pageProps} />
    </>
  );
};

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  return (
    <>
      <Head>
        <title>Squoolr</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <CacheProvider value={emotionCache}>
        <SquoolrThemeProvider>
          <App {...{ Component, pageProps, emotionCache }} />
        </SquoolrThemeProvider>
      </CacheProvider>
    </>
  );
}

export default CustomApp;
