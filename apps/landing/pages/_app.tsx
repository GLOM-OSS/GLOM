import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import createEmotionCache from '../config_mui/createEmotionCache';
import LanguageContextProvider, {
  useLanguage,
} from '../contexts/language/LanguageContextProvider';
import enMessages from '../languages/en-us';
import frMessages from '../languages/fr';
import './globalStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import { SquoolrThemeProvider } from '@squoolr/theme';

const App = (props) => {
  const { Component, pageProps, emotionCache } = props;
  const { activeLanguage, languageDispatch } = useLanguage();
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
        <SquoolrThemeProvider
          activeMessages={activeLanguage === 'En' ? enMessages : frMessages}
          activeLanguage={activeLanguage}
        >
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
      <LanguageContextProvider>
        <App {...{ Component, pageProps, emotionCache }} />
      </LanguageContextProvider>
    </>
  );
}

export default CustomApp;
