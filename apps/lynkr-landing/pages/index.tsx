import { AppBar, Box } from '@mui/material';
import Navbar, { ElevationScroll } from '../components/Navbar/Navbar';
import { useTheme } from '@glom/theme';
import HeroSection from '../components/HeroSection/HeroSection';

export function Index() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: theme.common.offWhite,
      }}
    >
      <ElevationScroll>
        <AppBar color="default">
          <Navbar />
        </AppBar>
      </ElevationScroll>
      <Box pt={{ desktop: 10, mobile: 6.75 }}>
        <HeroSection />
      </Box>

      <Box
        component="section"
        id="features"
        height="100vh"
        sx={{ backgroundColor: 'green', pt: 10.5 }}
      >
        Features
      </Box>
    </Box>
  );
}

export default Index;
