import {
  HelpOutlineRounded,
  KeyboardDoubleArrowLeftRounded,
  NotificationsActiveOutlined,
  ReportRounded,
  SearchRounded
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { getUser, logOut } from '@squoolr/api-services';
import { theme, useLanguage } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate } from 'react-router';
import LogoutDialog from '../components/logoutDialog';
import PrimaryNav from '../components/primaryNav';
import SecondaryNavItem from '../components/SecondaryNavItem';
import SwapAcademicYear from '../components/SwapAcademicYear';
import UserLayoutDisplay from '../components/UserLayoutDisplay';
import { useUser } from '../contexts/UserContextProvider';
import { NavChild, NavItem, PersonnelRole } from './interfaces';

export function Layout({
  navItems,
  callingApp,
}: {
  navItems: { role: PersonnelRole | 'administrator'; navItems: NavItem[] }[];
  callingApp: 'admin' | 'personnel';
}) {
  const [activeNavItem, setActiveNavItem] = useState<NavItem>();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(false);
  const [activeSecondaryNavItem, setActiveSecondaryNavItem] =
    useState<NavChild>();
  const { activeYear } = useUser();

  const { annualConfigurator, annualRegistry, annualTeacher, userDispatch } =
    useUser();

  const newRoles: (PersonnelRole | undefined)[] = [
    annualConfigurator ? 'secretary' : undefined,
    annualRegistry ? 'registry' : undefined,
    annualTeacher ? 'teacher' : undefined,
  ];
  const Roles: PersonnelRole[] = newRoles.filter(
    (_) => _ !== undefined
  ) as PersonnelRole[];

  const [activeRole, setActiveRole] = useState<PersonnelRole | 'administrator'>(
    callingApp === 'admin'
      ? 'administrator'
      : Roles.sort((a, b) => (a > b ? 1 : -1))[0]
  );
  const handleSwapRole = (newRole: PersonnelRole) => setActiveRole(newRole);

  const [roleNavigationItems, setRoleNavigationItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const RoleNavItems = navItems.find(({ role }) => role === activeRole);
    setRoleNavigationItems(RoleNavItems ? RoleNavItems.navItems : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole]);

  useEffect(() => {
    if (roleNavigationItems.length > 0) {
      const currentNavItem = roleNavigationItems.find(
        ({ title }) => title === location.pathname.split('/')[1]
      );
      setActiveNavItem(currentNavItem ?? roleNavigationItems[0]);
      setIsSecondaryNavOpen(
        currentNavItem ? currentNavItem.children.length > 0 : false
      );
    } else {
      setIsSecondaryNavOpen(false);
      setActiveNavItem(undefined);
      setActiveSecondaryNavItem(undefined);
      navigate('/');
      //TODO: call api here to NOTIFY ADMIN HERE that activeRole has no navItems then notify a 404
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleNavigationItems]);

  useEffect(() => {
    if (activeNavItem && activeNavItem.children) {
      const { children } = activeNavItem;
      const pathname = location.pathname.split('/').filter((_) => _ !== '');
      if (pathname.length === 2) {
        setActiveSecondaryNavItem(
          children.find(({ route }) => route === pathname[1]) ??
            (children.length > 0 ? children[0] : undefined)
        );
      } else
        setActiveSecondaryNavItem(
          children.length > 0 ? children[0] : undefined
        );
      if (children.length > 0)
        navigate(
          pathname.length > 2
            ? `/${pathname.join('/')}`
            : `${children[0].route}`
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNavItem]);

  useEffect(() => {
    getUser()
      .then((userData) => {
        userDispatch({ type: 'LOAD_USER', payload: { user: userData } });
      })
      .catch(() => {
        const notif = new useNotification();
        notif.notify({ render: 'verifyingAuth' });
        notif.update({
          type: 'ERROR',
          render: 'unauthenticatedUser',
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
        localStorage.setItem('previousRoute', location.pathname);
        navigate('/');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { languageDispatch } = useLanguage();

  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('squoolr_active_language') === 'En'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    logOut()
      .then(() => {
        userDispatch({ type: 'CLEAR_USER' })
        newNotification.update({
          render: formatMessage({ id: 'signOutSuccess' }),
        });
        localStorage.setItem('previousRoute', location.pathname);
        navigate('/');
      })
      .catch((error) => {
        newNotification.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={handleLogout}
              notification={newNotification}
              message={error?.message || formatMessage({ id: 'signOutFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
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
          navItems={roleNavigationItems}
          openLogoutDialog={() => setIsConfirmLogoutDialogOpen(true)}
          setActiveNavItem={(navItem: NavItem) => {
            const { children, title } = navItem;
            setActiveNavItem(navItem);
            setActiveSecondaryNavItem(
              children.length > 0 ? navItem.children[0] : undefined
            );
            setIsSecondaryNavOpen(children.length > 0);
            if (children.length > 0) navigate(`/${title}/${children[0].route}`);
            else navigate(`/${title}`);
          }}
          activeNavItem={activeNavItem}
          openSecondaryNav={() => setIsSecondaryNavOpen(true)}
        />
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
            activeRole={activeRole}
            selectRole={(newRole: PersonnelRole) =>
              handleSwapRole && handleSwapRole(newRole)
            }
          />
          <Typography variant="body2" sx={{ color: theme.common.label }}>
            {activeNavItem ? formatMessage({ id: activeNavItem.title }) : null}
          </Typography>
          <Scrollbars>
            <Box
              sx={{
                marginTop: theme.spacing(2.5),
                display: 'grid',
                rowGap: theme.spacing(1),
              }}
            >
              {activeNavItem
                ? activeNavItem.children.map((child, index) => (
                    <SecondaryNavItem
                      item={child}
                      key={index}
                      onClick={() => setActiveSecondaryNavItem(child)}
                    />
                  ))
                : null}
            </Box>
          </Scrollbars>
          {callingApp === 'personnel' && (
            <SwapAcademicYear callingApp={callingApp} activeYear={activeYear} />
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
                width: { mobile: '75%', laptop: '45%' },
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
                  sx={{ fontSize: 25, color: theme.common.label }}
                />
              </Tooltip>
              <Tooltip arrow title={formatMessage({ id: 'notifications' })}>
                <NotificationsActiveOutlined
                  sx={{ fontSize: 25, color: theme.common.label }}
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
                  .map((item, index) => {
                    const pathnameArray = location.pathname
                      .split('/')
                      .filter((_) => _ !== '');
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        onClick={() =>
                          index === 0
                            ? activeNavItem && activeNavItem.children.length > 0
                              ? navigate(
                                  `/${pathnameArray[0]}/${activeNavItem.children[0].route}`
                                )
                              : null
                            : navigate(
                                `/${pathnameArray
                                  .slice(0, index + 1)
                                  .join('/')}`
                              )
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
                        {isNaN(Number(item))
                          ? formatMessage({ id: item })
                          : item}
                      </Typography>
                    );
                  })}
              </Breadcrumbs>
            </Box>
            <Scrollbars>
              <Outlet />
            </Scrollbars>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Layout;
