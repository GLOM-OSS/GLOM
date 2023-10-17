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
    useState<boolean>(true);

  return (
    <Box>
      <ContactUs
        closeDialog={() => setIsContactUsDialogOpen(false)}
        open={isContactUsDialogOpen}
      />
      <Navbar openContactUs={()=>setIsContactUsDialogOpen(true)} />
      <Box
        sx={{
          height: '100%',
          maxWidth: '1700px',
          margin: '0 auto',
        }}
      >
        <Hero />
        <Features />
        <Partner />
        <Faq />
        <Footer />
      </Box>
    </Box>
  );
}

export default Index;
