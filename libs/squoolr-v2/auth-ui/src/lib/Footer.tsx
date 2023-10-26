import { useTheme } from '@glom/theme';
import { Facebook, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: 1,
        borderTop: `1px solid ${theme.common.line}`,
        padding: { desktop: '8px 0 8px 0', mobile: '8px' },
      }}
    >
      <Typography>&copy; GLOM LLC</Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          columnGap: 0.5,
        }}
      >
        <LinkedIn sx={{ color: theme.common.label }} fontSize="medium" />
        <Facebook sx={{ color: theme.common.label }} fontSize="medium" />
        <Twitter sx={{ color: theme.common.label }} fontSize="medium" />
        <YouTube sx={{ color: theme.common.label }} fontSize="medium" />
      </Box>
    </Box>
  );
}
