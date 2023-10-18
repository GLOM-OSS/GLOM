import { AppBar, Box, Button, Typography } from "@mui/material";
import Navbar, { ElevationScroll } from "../components/Navbar/Navbar";
import { useTheme } from "@glom/theme";
import HeroSection from "../components/HeroSection/HeroSection";
import FeatureSection from "../components/FeatureSection/FeatureSection";

export function Index() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.common.offWhite
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


      <Box component="section" id="features" sx={{ pt: 10.5 }}>
        <FeatureSection />
      </Box>


    </Box>
  );
}

export default Index;
