import {
  KeyboardDoubleArrowLeftRounded,
  ReportRounded,
} from '@mui/icons-material';
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';
import LogoutDialog from '../components/logoutDialog';
import PrimaryNav from '../components/primaryNav';
import SecondaryNavItem from '../components/SecondaryNavItem';
import SwapAcademicYear from '../components/SwapAcademicYear';
import UserLayoutDisplay from '../components/UserLayoutDisplay';
import { NavItem, PersonnelRole, User } from './interfaces';

export function Layout({
  navItems,
  user: { activeYear },
  user,
  callingApp,
  activeRole,
  userRoles,
  handleSwapRole,
}: {
  navItems: NavItem[];
  user: User;
  callingApp: 'admin' | 'personnel';
  activeRole: PersonnelRole | 'administrator';
  userRoles?: PersonnelRole[];
  handleSwapRole?: (newRole: PersonnelRole) => void;
}) {
  useEffect(() => {
    if (navItems.length > 0) {
      setActiveNavItem(navItems[0]);
      setIsSecondaryNavOpen(true);
    }
  }, [navItems]);
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const { formatMessage } = intl;

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
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [activeNavItem, setActiveNavItem] = useState<NavItem>();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(false);
  return (
    <>
      <LogoutDialog
        closeDialog={() => setIsConfirmLogoutDialogOpen(false)}
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
          isLoggingOut={isSubmitting}
          isLogoutDialogOpen={isConfirmLogoutDialogOpen}
          navItems={navItems}
          openLogoutDialog={() => setIsConfirmLogoutDialogOpen(true)}
          setActiveNavItem={(navItem: NavItem) => setActiveNavItem(navItem)}
          activeNavItem={activeNavItem}
          openSecondaryNav={() => setIsSecondaryNavOpen(true)}
        />
        {activeNavItem && (
          <Box
            component={Collapse}
            timeout={170}
            orientation="horizontal"
            in={isSecondaryNavOpen}
            sx={{
              padding: isSecondaryNavOpen
                ? `${theme.spacing(2.375)} ${theme.spacing(1.75)}`
                : 0,
              borderRight: `1px solid ${theme.common.line}`,
              '& .MuiCollapse-wrapper>.MuiCollapse-wrapperInner': {
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr auto auto',
                alignItems: 'start',
              },
              position: 'relative',
              paddingTop: theme.spacing(4),
            }}
          >
            <IconButton
              size="small"
              onClick={() => setIsSecondaryNavOpen(false)}
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              <Tooltip arrow title={formatMessage({ id: 'collapseMenu' })}>
                <KeyboardDoubleArrowLeftRounded
                  sx={{ fontSize: 20, color: theme.common.titleActive }}
                />
              </Tooltip>
            </IconButton>

            <UserLayoutDisplay
              user={user}
              activeRole={activeRole}
              userRoles={userRoles}
              selectRole={(newRole: PersonnelRole) =>
                handleSwapRole && handleSwapRole(newRole)
              }
            />
            <Typography variant="body2" sx={{ color: theme.common.label }}>
              {activeNavItem.title}
            </Typography>
            <Scrollbars>
              <Box
                sx={{
                  marginTop: theme.spacing(2.5),
                  display: 'grid',
                  rowGap: theme.spacing(1),
                }}
              >
                {activeNavItem.children.map((child, index) => (
                  <SecondaryNavItem item={child} key={index} />
                ))}
              </Box>
            </Scrollbars>
            {callingApp === 'personnel' && (
              <SwapAcademicYear
                callingApp={callingApp}
                activeYear={activeYear}
              />
            )}
            <Box
              sx={{
                display: 'grid',
                justifyItems: 'center',
                marginTop: theme.spacing(3.75),
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.common.placeholder }}
              >
                {`© ${new Date().getFullYear()} Squoolr`}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.common.placeholder }}
              >
                {formatMessage({ id: 'allRightsReserved' })}
              </Typography>
            </Box>
            {/* </Collapse> */}
            {/* )} */}
          </Box>
        )}
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
activeYear:'Active Year',
changeActiveYear:'Change active year',
allRightsReserved:'All rights reserved',
fetchingAcademicYears:'Getting your academic years...',
getAcademicYearsFailed:'Something went wrong while we tried getting your academic years. please try again'
onlyOneAcademicYear:'You are already in your only academic year!',
close:'Close',
administrator:'Squoolr Admin',
teacher: 'Teacher', 
secretary: 'Secretary',
registry: 'Registry',
listRoles: 'Roles',
collapseMenu:'Collapse menu'
 */
