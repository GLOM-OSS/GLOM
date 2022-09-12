import { CacheProvider, EmotionCache } from '@emotion/react';
import { IntlProvider } from 'react-intl';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Flip, ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import createEmotionCache from '../config_mui/createEmotionCache';
import LanguageContextProvider, {
  useLanguage,
} from '../contexts/language/LanguageContextProvider';
import enMessages from '../languages/en-us';
import frMessages from '../languages/fr';
import theme from '../config_mui/theme/theme';
import './globalStyles.css';

const App = (props) => {
  const { Component, pageProps, emotionCache } = props;
  const { activeLanguage, languageDispatch } = useLanguage();
  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('skeleton_active_language') === 'En'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CacheProvider value={emotionCache}>
        <IntlProvider
          messages={activeLanguage === 'En' ? enMessages : frMessages}
          locale={activeLanguage}
          defaultLocale="Fr"
        >
          <ThemeProvider theme={theme}>
            <ToastContainer
              position="top-right"
              autoClose={1000}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              transition={Flip}
            />
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </IntlProvider>
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
