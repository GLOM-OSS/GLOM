import { CacheProvider, EmotionCache } from '@emotion/react';
import { SquoolrThemeProvider, useLanguage } from '@glom/theme';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import LandingLayout from '../components/layout/layout';
import createEmotionCache from '../config_mui/createEmotionCache';
import './globalStyles.css';

//TODO squoolr type import example
import type { SubmitSchoolDemandPayload } from '@glom/data-types/squoolr';

const App = (props) => {
  const { Component, pageProps } = props;
  const { languageDispatch } = useLanguage();
  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('squoolr_active_language') === 'en'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <LandingLayout>
        <Component {...pageProps} />
      </LandingLayout>
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
