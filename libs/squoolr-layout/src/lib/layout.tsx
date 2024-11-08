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
import { getUser, logOut } from '@squoolr/api-services';
import {
  INavItem,
  IUser,
  INavChild,
  PersonnelRole,
  UserRole,
} from '@squoolr/interfaces';
import { theme, useLanguage } from '@glom/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import SecondaryNavItem from '../components/SecondaryNavItem';
import SwapAcademicYear from '../components/SwapAcademicYear';
import UserLayoutDisplay from '../components/UserLayoutDisplay';
import LogoutDialog from '../components/logoutDialog';
import PrimaryNav from '../components/primaryNav';
import { useUser } from '../contexts/UserContextProvider';
import { getUserRoles } from './helpers';

export function Layout({
  navItems,
  callingApp,
}: {
  navItems: {
    role: UserRole;
    navItems: INavItem[];
  }[];
  callingApp: 'admin' | 'personnel' | 'student';
}) {
  const [activeNavItem, setActiveNavItem] = useState<INavItem>();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(false);
  const [activeSecondaryNavItem, setActiveSecondaryNavItem] =
    useState<INavChild>();
  const { activeYear } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const { formatMessage } = intl;

  const handleSwapRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    localStorage.setItem('activeRole', newRole);
  };

  const { userDispatch } = useUser();

  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>();

  const [roleNavigationItems, setRoleNavigationItems] = useState<INavItem[]>(
    []
  );

  useEffect(() => {
    const RoleNavItems = navItems.find(({ role }) => role === activeRole);
    if (RoleNavItems) setRoleNavigationItems(RoleNavItems.navItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole]);

  useEffect(() => {
    if (roleNavigationItems.length > 0) {
      let currentNavItem = roleNavigationItems.find(
        ({ route }) => route === location.pathname.split('/')[2]
      );
      if (!currentNavItem) currentNavItem = roleNavigationItems[0];
      setActiveNavItem(currentNavItem ?? roleNavigationItems[0]);
      setIsSecondaryNavOpen(currentNavItem.children.length > 0);
    } else {
      setIsSecondaryNavOpen(false);
      setActiveNavItem(undefined);
      setActiveSecondaryNavItem(undefined);
      //TODO: call api here to NOTIFY ADMIN HERE that activeRole has no navItems then notify a 404
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleNavigationItems]);

  useEffect(() => {
    if (activeNavItem) {
      const { children } = activeNavItem;
      const pathname = location.pathname.split('/').filter((_) => _ !== '');
      if (pathname.length === 3) {
        setActiveSecondaryNavItem(
          children.find(({ route }) => route === pathname[2]) ??
            (children.length > 0 ? children[0] : undefined)
        );
      } else
        setActiveSecondaryNavItem(
          children.length > 0 ? children[0] : undefined
        );
      if (children.length > 0)
        if (activeRole === pathname[0]) {
          navigate(
            pathname.length >= 3 &&
              children.find(({ route }) => route === pathname[2])
              ? `/${pathname.join('/')}`
              : `${children[0].route}`
          );
        } else if (callingApp !== 'admin') {
          navigate(
            `/${activeRole}/${activeNavItem.route}/${children[0].route}`
          );
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNavItem]);

  useEffect(() => {
    getUser()
      .then((user) => {
        userDispatch({
          type: 'LOAD_USER',
          payload: {
            user,
          },
        });
        const Roles = getUserRoles(user as IUser, callingApp);
        console.log(Roles);
        if (Roles.length === 0) navigate('/');
        setUserRoles(Roles);

        const x = localStorage.getItem('activeRole');
        const storageActiveRole = x ?? '';
        const routeRole = location.pathname.split('/')[1];

        setActiveRole(
          callingApp === 'admin'
            ? 'administrator'
            : callingApp === 'student'
            ? 'student'
            : Roles.includes(routeRole as PersonnelRole)
            ? (routeRole as PersonnelRole)
            : Roles.includes(storageActiveRole as UserRole)
            ? (storageActiveRole as UserRole)
            : Roles[0]
        );
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
        localStorage.setItem('previousRoute', location.pathname); //TODO; remove in production
        setActiveRole('student'); //TODO: REMOVE IN PRODUCTION
        // navigate('/');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { languageDispatch } = useLanguage();

  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('squoolr_active_language') === 'en'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        userDispatch({ type: 'CLEAR_USER' });
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
  const params = useParams();

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
          setActiveNavItem={(navItem: INavItem) => {
            const { children, route } = navItem;
            setActiveNavItem(navItem);
            setActiveSecondaryNavItem(
              children.length > 0 ? navItem.children[0] : undefined
            );
            setIsSecondaryNavOpen(children.length > 0);
            if (children.length > 0)
              navigate(`/${activeRole}/${route}/${children[0].route}`);
            else navigate(`/${activeRole}/${route}`);
          }}
          activeNavItem={activeNavItem}
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
            userRoles={userRoles}
            activeRole={activeRole}
            selectRole={(newRole: UserRole) => handleSwapRole(newRole)}
          />
          <Typography variant="body2" sx={{ color: theme.common.label }}>
            {activeNavItem ? formatMessage({ id: activeNavItem.title }) : null}
          </Typography>
          {/*TODO: ADD SCROLLBARS AGAIN. BUT NOTICE HOW IT PREVENTS THE FULLWIDTH CONCEPT. TRY TO SOLVE IT */}
          {/* <Scrollbars> */}
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
          {/* </Scrollbars> */}
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
                  .slice(1)
                  .map((item, index) => {
                    const pathnameArray = location.pathname
                      .split('/')
                      .filter((_) => _ !== '');
                    const paramTexts = Object.keys(params).map(
                      (_item) => params[_item]
                    );
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        onClick={() =>
                          index === 0
                            ? activeNavItem && activeNavItem.children.length > 0
                              ? navigate(
                                  `/${pathnameArray[0]}/${pathnameArray[1]}/${activeNavItem.children[0].route}`
                                )
                              : null
                            : navigate(
                                `/${pathnameArray
                                  .slice(0, index + 2)
                                  .join('/')}`
                              )
                        }
                        sx={{
                          cursor: 'pointer',
                          fontWeight:
                            index ===
                            location.pathname.split('/').filter((_) => _ !== '')
                              .length -
                              2
                              ? 400
                              : 300,
                          color:
                            location.pathname.split('/').filter((_) => _ !== '')
                              .length - 2
                              ? theme.common.titleActive
                              : 'inherit',

                          '&:hover': {
                            textDecoration: 'underline',
                            fontWeight: 400,
                            color: theme.common.titleActive,
                          },
                        }}
                      >
                        {isNaN(Number(item)) && !paramTexts.includes(item)
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
