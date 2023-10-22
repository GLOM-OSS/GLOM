import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box } from '@mui/material';
import { GlomThemeProvider } from '@glom/theme';
import 'react-toastify/dist/ReactToastify.css';
import '../public/styles/global.scss';
import '../public/styles/notifGlobalStyles.css';
import '../public/styles/phoneNumberStyles.css';
import '../public/styles/reset.css';
import '../public/styles/root.scss';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from 'react';
import ContactUs from '../components/contact-us/ContactUs';
import Navbar from '../components/navigation/Navbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
            canDemand={false}
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
