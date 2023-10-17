import { useActiveLanguage, useDispatchLanguage, useTheme } from '@glom/theme';
import list from '@iconify/icons-fluent/list-28-filled';
import { Icon } from '@iconify/react';
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  capitalize,
  useScrollTrigger,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement, useState } from 'react';
import { useIntl } from 'react-intl';
import { SideNav } from './SideNav';

export function ElevationScroll({ children }: { children: ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 40 : 0,
  });
}

export const scrollToSection = (sectionId: string) => {
  const section = document.querySelector(sectionId);
  section?.scrollIntoView({ behavior: 'smooth' });
};

export function getBaseUrl(usage: string) {
  const envBaseUrl = process.env['NX_API_BASE_URL'];
  if (envBaseUrl) return envBaseUrl;
  if (typeof window !== 'undefined')
    return `https://${usage}${
      location.href.includes('stage') ? '-stage' : ''
    }.squoolr.com`;
  return `https://${usage}-stage.squoolr.com`;
}

interface INavItem {
  item: string;
  route: string;
}

const landingNavElements: INavItem[] = [
  { item: 'features', route: '#features' },
  { item: 'partners', route: '#partners' },
  { item: 'pricing', route: 'pricing' },
  { item: 'faq', route: '#faq' },
];

export function LogoHolder({
  size,
  color = '#12192C',
}: {
  size?: number;
  color?: string;
}) {
  const { push } = useRouter();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        justifySelf: 'start',
        cursor: 'pointer',
      }}
      onClick={() => push('/')}
    >
      <Box sx={{ display: { mobile: 'none', laptop: 'block' } }}>
        <Image
          src="/logo.png"
          alt="Squoolr logo"
          height={size ?? 68}
          width={size ?? 68}
        />
      </Box>
      <Box sx={{ display: { mobile: 'block', laptop: 'none' } }}>
        <Image
          src="/logo.png"
          alt="Squoolr logo"
          height={size ?? 36}
          width={size ?? 36}
        />
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color,
          fontSize: {
            laptop: theme.typography.h3.fontSize,
            mobile: theme.typography.h4.fontSize,
          },
        }}
      >
        Squoolr
      </Typography>
    </Box>
  );
}

export default function Navbar({
  openContactUs,
}: {
  openContactUs: () => void;
}) {
  const { formatMessage } = useIntl();
  const { push, pathname, asPath } = useRouter();
  const theme = useTheme();
  const changeLanguage = useDispatchLanguage();
  const activeLanguage = useActiveLanguage();

  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);

  return (
    <>
      <SideNav
        navItems={landingNavElements}
        close={() => setIsSideNavOpen(false)}
        open={isSideNavOpen}
        openContactUs={openContactUs}
      />
      <ElevationScroll>
        <AppBar color="default">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                mobile: '1fr auto auto',
                desktop: 'auto 1fr auto auto',
              },
              justifyItems: 'center',
              columnGap: 1,
              alignItems: 'center',
              padding: {
                mobile: '11px 16px',
                desktop: '11px 118px',
              },
              backgroundColor: '#EDF2FB',
            }}
          >
            <LogoHolder />
            <Box
              sx={{
                display: {
                  desktop: 'grid',
                  mobile: 'none',
                  gridAutoFlow: 'column',
                  columnGap: '40px',
                  alignItems: 'center',
                },
              }}
            >
              {landingNavElements.map(({ item, route }, index) => (
                <Typography
                  onClick={() => {
                    scrollToSection(route);
                    push(route);
                  }}
                  key={index}
                  className="p3"
                  sx={{
                    position: 'relative',
                    transition: '0.2s',
                    cursor: 'pointer',
                    color: 'var(--body) !important',
                    textAlign: 'center',
                    '& a': {
                      textDecoration: 'none',
                    },
                    '&::before': {
                      transition: '0.2s',
                      position: 'absolute',
                      left: '0px',
                      bottom: '-5px',
                      height: '3px',
                      content: '""',
                      width:
                        pathname === route ||
                        `/${pathname.split('/').filter((_) => _ !== '')[0]}` ===
                          route ||
                        asPath.includes(route)
                          ? '100%'
                          : 0,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '5px',
                    },
                    '&:hover::before': {
                      transition: '0.2s',
                      width: '100%',
                      backgroundColor:
                        theme.palette[
                          pathname === route ||
                          `/${
                            pathname.split('/').filter((_) => _ !== '')[0]
                          }` === route ||
                          asPath.includes(route)
                            ? 'secondary'
                            : 'primary'
                        ].main,
                    },
                  }}
                >
                  {formatMessage({ id: item })}
                </Typography>
              ))}
              <Typography
                className="p3"
                onClick={openContactUs}
                sx={{
                  position: 'relative',
                  transition: '0.2s',
                  cursor: 'pointer',
                  color: 'var(--body) !important',
                  textAlign: 'center',
                  '&::before': {
                    transition: '0.2s',
                    position: 'absolute',
                    left: '0px',
                    bottom: '-5px',
                    height: '3px',
                    content: '""',
                    width: 0,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '5px',
                  },
                  '&:hover::before': {
                    transition: '0.2s',
                    width: '100%',
                    backgroundColor: theme.palette['primary'].main,
                  },
                }}
              >
                {formatMessage({ id: 'contactUs' })}
              </Typography>
            </Box>
            <FormControl
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: 1,
                  paddingBottom: 1,
                },
              }}
            >
              <Select
                value={activeLanguage}
                onChange={() => {
                  changeLanguage({
                    type:
                      capitalize(activeLanguage) === 'En'
                        ? 'USE_FRENCH'
                        : 'USE_ENGLISH',
                  });
                }}
              >
                <MenuItem value={'en'}>{formatMessage({ id: 'en' })}</MenuItem>
                <MenuItem value={'fr'}>{formatMessage({ id: 'fr' })}</MenuItem>
              </Select>
            </FormControl>
            <Tooltip arrow title={formatMessage({ id: 'menu' })}>
              <IconButton
                sx={{
                  display: {
                    mobile: 'block',
                    desktop: 'none',
                  },
                }}
                size="small"
                onClick={() => setIsSideNavOpen(true)}
              >
                <Icon
                  icon={list}
                  style={{
                    height: '32px',
                    width: '32px',
                    color: 'black',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                display: {
                  mobile: 'none',
                  desktop: 'grid',
                },
                gridAutoFlow: 'column',
                gap: 1,
              }}
            >
              <Button variant="text" color="primary" sx={{ fontSize: '16px' }}>
                {formatMessage({ id: 'verifyDemandStatus' })}
              </Button>
              <Button variant="contained" color="primary">
                {formatMessage({ id: 'getEarlyAccess' })}
              </Button>
            </Box>
          </Box>
        </AppBar>
      </ElevationScroll>
    </>
  );
}
