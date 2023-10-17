import { Box } from '@mui/material';
import Navbar from '../components/navigation/Navbar';
import Hero from '../components/hero/Hero';
import Partner from '../components/partner/Partner';
import Faq from '../components/faq/Faq';
import { Footer } from '../components/footer/Footer';
import Features from '../components/features/Features';
import ContactUs from '../components/contact-us/ContactUs';
import { useState } from 'react';

export function Index() {
  const [isContactUsDialogOpen, setIsContactUsDialogOpen] =
    useState<boolean>(false);
  const [isEarlyAccesDialogOpen, setIsEarlyAccesDialogOpen] =
    useState<boolean>(true);

  return (
    <Box>
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
        }}
      >
        <Hero openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)} />
        <Features openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)} />
        <Partner />
        <Faq />
        <Footer
          canDemand={false}
          openContactUs={() => setIsContactUsDialogOpen(true)}
          openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)}
        />
      </Box>
    </Box>
  );
}

export default Index;
