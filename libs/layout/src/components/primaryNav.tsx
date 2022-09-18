import { LogoutRounded } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { NavItem } from '../lib/interfaces';
import favicon from '../lib/logo.png';
import PrimaryNavItem from './PrimaryNavItem';

export default function PrimaryNav({
  isLoggingOut,
  isLogoutDialogOpen,
  navItems,
  setActiveNavItem,
  openLogoutDialog,
  activeNavItem,
  openSecondaryNav,
}: {
  isLoggingOut: boolean;
  isLogoutDialogOpen: boolean;
  navItems: NavItem[];
  setActiveNavItem: (navItem: NavItem) => void;
  openLogoutDialog: () => void;
  activeNavItem?: NavItem;
  openSecondaryNav: () => void;
}) {
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
        boxShadow: '0px 4px 8px 2px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.common.background,
          borderRadius: '100%',
          padding: ` ${theme.spacing(0.5)} ${theme.spacing(1)}`,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <Tooltip arrow title={formatMessage({ id: 'dashboard' })}>
          <img src={favicon} alt={'Squoolr icon'} width={35} />
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: 'grid',
          alignContent: 'center',
          rowGap: theme.spacing(2.5),
        }}
      >
        {navItems.map((navItem, index) => (
          <PrimaryNavItem
            navItem={navItem}
            key={index}
            activeNavItem={activeNavItem}
            handleSelect={() => {
              setActiveNavItem(navItem);
              // openSecondaryNav();
            }}
          />
        ))}
      </Box>
      <IconButton
        onClick={() =>
          isLoggingOut || isLogoutDialogOpen ? null : openLogoutDialog()
        }
      >
        {isLoggingOut || isLogoutDialogOpen ? (
          <CircularProgress
            sx={{ color: theme.common.background }}
            thickness={3}
            size={30}
          />
        ) : (
          <Tooltip arrow title={formatMessage({ id: 'logout' })}>
            <LogoutRounded
              fontSize="large"
              sx={{
                color: theme.common.background,
                justifySelf: 'center',
                fontSize: 30,
              }}
            />
          </Tooltip>
        )}
      </IconButton>
    </Box>
  );
}
