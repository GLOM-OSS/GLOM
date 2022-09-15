import { Box, Tooltip } from '@mui/material';
import { theme } from '@squoolr/theme';
import { NavItem } from '../lib/interfaces';

export default function PrimaryNavItem({
  navItem: { Icon, title, id },
  activeNavItem: { id: activeId },
  handleSelect,
}: {
  navItem: NavItem;
  activeNavItem: NavItem;
  handleSelect: () => void;
}) {
  return (
    <Box
      sx={{
        height: 50,
        position: 'relative',
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        transition: '0.2s',
        '&::before': {
          transition: '0.2s',
          position: 'absolute',
          left: '0px',
          bottom: '0px',
          width: activeId === id ? '4px' : 0,
          content: '""',
          height: '100%',
          backgroundColor: theme.common.background,
        },
        ':hover': {
          transition: '0.2s',
          background: theme.palette.primary.dark,
        },
      }}
      onClick={handleSelect}
    >
      <Tooltip arrow title={title}>
        <Icon
          fontSize="medium"
          sx={{ color: theme.common.background, fontSize: 30 }}
        />
      </Tooltip>
    </Box>
  );
}
