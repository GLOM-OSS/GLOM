import { Box } from '@mui/material';
import Navbar from '../navbar/navbar';

export default function LandingLayout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <Navbar />
      <Box sx={{ padding: `0 7.1%` }}>{children}</Box>
    </Box>
  );
}
