import {
  HelpOutlineRounded,
  KeyboardDoubleArrowLeftRounded,
  NotificationsActiveOutlined,
  ReportRounded,
  SearchRounded,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router';
import LogoutDialog from '../components/logoutDialog';
import PrimaryNav from '../components/primaryNav';
import SecondaryNavItem from '../components/SecondaryNavItem';
import SwapAcademicYear from '../components/SwapAcademicYear';
import UserLayoutDisplay from '../components/UserLayoutDisplay';
import UserContextProvider from '../contexts/UserContextProvider';
import { NavChild, NavItem, PersonnelRole, User } from './interfaces';

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
  const [activeNavItem, setActiveNavItem] = useState<NavItem>();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(false);
  const [activeSecondaryNavItem, setActiveSecondaryNavItem] =
    useState<NavChild>();

  useEffect(() => {
    if (navItems.length > 0) {
      const currentNavItem = navItems.find(
        ({ title }) => title === location.pathname.split('/')[1]
      );
      setActiveNavItem(currentNavItem ?? navItems[0]);
      setIsSecondaryNavOpen(
        currentNavItem ? currentNavItem.children.length > 0 : false
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeNavItem && activeNavItem.children) {
      const { children } = activeNavItem;
      const pathname = location.pathname.split('/').filter((_) => _ !== '');
      if (pathname.length === 2) {
        setActiveSecondaryNavItem(
          children.find(({ route }) => route === pathname[1]) ??
            (children.length > 0 ? children[0] : undefined)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNavItem]);

  //TODO UNCOMMENT THIS USE EFFECT WHEN DONE INTERGRATING
  // useEffect(() => {
  //   //TODO: call api here to Verify if user is authenticated here if user is not, then disconnect them and send them to sign in page
  //   setTimeout(() => {
  //     if (random() > 5) {
  //       //TODO: write user data to context here
  //     } else {
  //       const notif = new useNotification();
  //       notif.notify({ render: 'verifyingAuth' });
  //       notif.update({
  //         type: 'ERROR',
  //         render: 'unauthenticatedUser',
  //         autoClose: false,
  //         icon: () => <ReportRounded fontSize="medium" color="error" />,
  //       });
  //       localStorage.setItem('previousRoute', location.pathname);
  //       navigate('/');
  //     }
  //   }, 3000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  return (
    <UserContextProvider>
      <>
        <LogoutDialog
          closeDialog={() => setIsConfirmLogoutDialogOpen(false)}
          isDialogOpen={isConfirmLogoutDialogOpen}
          logout={handleLogout}
          isSubmitting={isSubmitting}
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
            setActiveNavItem={(navItem: NavItem) => {
              const { children, title } = navItem;
              setActiveNavItem(navItem);
              setActiveSecondaryNavItem(
                children.length > 0 ? navItem.children[0] : undefined
              );
              setIsSecondaryNavOpen(children.length > 0);
              if (children.length > 0)
                navigate(`/${title}/${children[0].route}`);
              else navigate(`/${title}`);
            }}
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
                    <SecondaryNavItem
                      item={child}
                      key={index}
                      onClick={() => setActiveSecondaryNavItem(child)}
                    />
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
            </Box>
          )}
          <Box
            sx={{
              padding: `${theme.spacing(2.75)} ${theme.spacing(4.5)} `,
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                columnGap: theme.spacing(2),
              }}
            >
              <TextField
                placeholder={formatMessage({ id: 'searchSomething' })}
                variant="outlined"
                size="small"
                sx={{
                  width: '25%',
                  '& input': { ...theme.typography.caption },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded
                        sx={{ fontSize: 25, color: theme.common.body }}
                        color="primary"
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto',
                  columnGap: theme.spacing(3),
                }}
              >
                <Tooltip arrow title={formatMessage({ id: 'helpCenter' })}>
                  <HelpOutlineRounded
                    sx={{ fontSize: 25, color: theme.common.body }}
                  />
                </Tooltip>
                <Tooltip arrow title={formatMessage({ id: 'notifications' })}>
                  <NotificationsActiveOutlined
                    sx={{ fontSize: 25, color: theme.common.body }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: theme.spacing(8),
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
              }}
            >
              <Box sx={{ marginBottom: theme.spacing(5) }}>
                <Typography variant="h5">
                  {formatMessage({
                    id: activeSecondaryNavItem
                      ? activeSecondaryNavItem.page_title
                      : 'emptySection',
                  })}
                </Typography>
                <Breadcrumbs
                  sx={{
                    marginTop: theme.spacing(1 / 4),
                    '& .MuiBreadcrumbs-separator': {
                      ...theme.typography.caption,
                      margin: '0 3px',
                    },
                  }}
                >
                  {location.pathname
                    .split('/')
                    .filter((_) => _ !== '')
                    .map((item, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        onClick={() =>
                          navigate(location.pathname.split(item)[0] + item)
                        }
                        sx={{
                          cursor: 'pointer',
                          fontWeight:
                            index ===
                            location.pathname.split('/').filter((_) => _ !== '')
                              .length -
                              1
                              ? 400
                              : 200,
                          color:
                            location.pathname.split('/').filter((_) => _ !== '')
                              .length - 1
                              ? theme.common.titleActive
                              : 'inherit',

                          '&:hover': {
                            textDecoration: 'underline',
                            fontWeight: 400,
                            color: theme.common.titleActive,
                          },
                        }}
                      >
                        {formatMessage({ id: item })}
                      </Typography>
                    ))}
                </Breadcrumbs>
              </Box>
              <Scrollbars>
                <Outlet />
              </Scrollbars>
            </Box>
          </Box>
        </Box>
      </>
    </UserContextProvider>
  );
}

export default Layout;
