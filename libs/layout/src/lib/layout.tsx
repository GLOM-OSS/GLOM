import { ReportRounded, SettingsRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useState } from 'react';
import { IntlShape } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';
import LogoutDialog from '../components/logoutDialog';
import PrimaryNav from '../components/primaryNav';
import { NavItem } from './interfaces';

export function Layout({
  intl: { formatMessage },
  intl,
  navItems,
}: {
  intl: IntlShape;
  navItems: NavItem[];
}) {
  // export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<useNotification[]>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmLogoutDialogOpen, setIsConfirmLogoutDialogOpen] =
    useState<boolean>(false);

  const handleLogout = () => {
    setIsSubmitting(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const newNotification = new useNotification();
    if (notifications) setNotifications([...notifications, newNotification]);
    else setNotifications([newNotification]);
    newNotification.notify({
      render: formatMessage({ id: 'signingUserOut' }),
    });
    //TODO: CALL LOGOUT API HERE
    setTimeout(() => {
      setIsSubmitting(false);
      if (random() > 5) {
        newNotification.update({
          render: formatMessage({ id: 'signOutSuccess' }),
        });
        localStorage.setItem('previousRoute', location.pathname);
        navigate('/');
      } else {
        newNotification.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={handleLogout}
              notification={newNotification}
              //TODO: message comes from backend
              message={formatMessage({ id: 'signOutFailed' })}
              intl={intl}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [activeNavItem, setActiveNavItem] = useState<NavItem>({
    id: 1,
    children: [],
    Icon: SettingsRounded,
    title: formatMessage({ id: 'settings' }),
  });
  return (
    <>
      <LogoutDialog
        closeDialog={() => setIsConfirmLogoutDialogOpen(false)}
        intl={intl}
        isDialogOpen={isConfirmLogoutDialogOpen}
        logout={handleLogout}
      />
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          backgroundColor: theme.common.background,
        }}
      >
        <PrimaryNav
          intl={intl}
          isLoggingOut={isSubmitting}
          isLogoutDialogOpen={isConfirmLogoutDialogOpen}
          navItems={navItems}
          openLogoutDialog={() => setIsConfirmLogoutDialogOpen(true)}
          setActiveNavItem={(navItem: NavItem) => setActiveNavItem(navItem)}
          activeNavItem={activeNavItem}
        />
      </Box>
    </>
  );
}

export default Layout;

/*
  confirmLogoutTitle: 'Confirm Logout',
  confirmLogoutMessage: 'Are you sure you want to logout? Click logout to continue or cancel',
  cancel:'Cancel',
  logout:'Logout',
  dashboard:'Dashboard',
  signingUserOut:'Logging user out. Please be patient',
  signOutSuccess: 'Your work session has successfully been logged out',
  signOutFailed:'Something went wrong while logging you out. Please try again',

 */
