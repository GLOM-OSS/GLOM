import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import createEmotionCache from '../config_mui/createEmotionCache';
import './globalStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import { SquoolrThemeProvider, useLanguage } from '@squoolr/theme';

const App = (props) => {
  const { Component, pageProps, emotionCache } = props;
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
      <CacheProvider value={emotionCache}>
        <SquoolrThemeProvider>
          <Component {...pageProps} />
        </SquoolrThemeProvider>
      </CacheProvider>
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
        <App {...{ Component, pageProps, emotionCache }} />
    </>
  );
}

export default CustomApp;
