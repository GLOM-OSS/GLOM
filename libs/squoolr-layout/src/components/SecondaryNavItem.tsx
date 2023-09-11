import { Box, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { NavLink } from 'react-router-dom';
import { INavChild } from '@squoolr/interfaces';

export default function SecondaryNavItem({
  item: { route, title },
  onClick,
}: {
  item: INavChild;
  onClick: () => void;
}) {
  return (
    <Box
      component={NavLink}
      onClick={onClick}
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
          padding: `${theme.spacing(1)} ${theme.spacing(2.5)} `,
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
