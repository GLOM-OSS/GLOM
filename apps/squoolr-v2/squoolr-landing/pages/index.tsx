import { Box } from '@mui/material';
import Navbar from '../components/navigation/Navbar';
import Hero from '../components/hero/Hero';
import Partner from '../components/partner/Partner';
import Faq from '../components/faq/Faq';

export function Index() {
  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          height: '100%',
          maxWidth: '1700px',
          margin: '0 auto',
        }}
      >
        <Hero />
        <Partner />
        <Faq />
      </Box>
    </Box>
  );
}

export default Index;
