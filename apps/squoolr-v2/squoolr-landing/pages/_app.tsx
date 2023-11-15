import { GlomThemeProvider } from '@glom/theme';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ContactUs from '../components/contact-us/ContactUs';
import StatusDialog from '../components/demand/status/StatusDialog';
import Navbar from '../components/navigation/Navbar';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/phoneNumberStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const [isContactUsDialogOpen, setIsContactUsDialogOpen] =
    useState<boolean>(false);
  const [isEarlyAccesDialogOpen, setIsEarlyAccesDialogOpen] =
    useState<boolean>(false);

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
  const [demandCode, setDemandCode] = useState<string>('');
  const { query, pathname } = useRouter();

  useEffect(() => {
    if (
      typeof query.status !== 'undefined' &&
      pathname.split('/').join('') === ''
    ) {
      if (query.status !== 'true') setDemandCode(query.status as string);
      setIsStatusDialogOpen(true);
    }
  }, []);

  return (
    <GlomThemeProvider defaultLang="en">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <StatusDialog
            closeDialog={() => setIsStatusDialogOpen(false)}
            open={isStatusDialogOpen}
            demandCode={demandCode}
          />

          <ContactUs
            closeDialog={() => setIsContactUsDialogOpen(false)}
            open={isContactUsDialogOpen}
          />
          <ContactUs
            closeDialog={() => setIsEarlyAccesDialogOpen(false)}
            open={isEarlyAccesDialogOpen}
            usage="EarlyAccess"
          />
          <Navbar
            openContactUs={() => setIsContactUsDialogOpen(true)}
            openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)}
            openStatusDialog={() => setIsStatusDialogOpen(true)}
            canDemand={true}
          />
          <Box
            sx={{
              height: '100%',
              maxWidth: '1700px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <Component
              {...pageProps}
              setIsContactUsDialogOpen={setIsContactUsDialogOpen}
              setIsEarlyAccesDialogOpen={setIsEarlyAccesDialogOpen}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </GlomThemeProvider>
  );
}

export default CustomApp;
