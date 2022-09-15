import { Box, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { NavLink } from 'react-router-dom';
import { NavChild } from '../lib/interfaces';

export default function SecondaryNavItem({
  item: { route, title },
}: {
  item: NavChild;
}) {
  return (
    <Box
      component={NavLink}
      to={route}
      sx={{
        color: theme.common.titleActive,
        textDecoration: 'none',
        '&.active>p': {
          backgroundColor: lighten(theme.palette.primary.main, 0.85),
          color: theme.palette.primary.main,
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          width: '100%',
          padding: `${theme.spacing(2)} ${theme.spacing(2.5)} `,
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: lighten(theme.palette.primary.dark, 0.85),
          },
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
