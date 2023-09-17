import { AppBar, Box } from '@mui/material';
import Navbar, { ElevationScroll } from '../components/Navbar/Navbar';
import { useTheme } from '@glom/theme';

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

      <Box
        component="section"
        id="hello"
        height="100vh"
        sx={{ backgroundColor: 'orange' }}
      >
        Hello
      </Box>
      <Box
        component="section"
        id="features"
        height="100vh"
        sx={{ backgroundColor: 'green', py: 10.5 }}
      >
        Features
      </Box>
    </Box>
  );
}

export default Index;
