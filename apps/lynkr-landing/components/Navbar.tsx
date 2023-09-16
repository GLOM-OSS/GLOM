import globe from '@iconify/icons-fluent/globe-48-regular';
import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useTheme, useLanguage } from '@glom/theme';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';
import { useIntl } from 'react-intl';
import { INavItem, NavItem } from './Navbar/NavItem';

export function ElevationScroll({ children }: { children: ReactElement }) {
  return cloneElement(children, {
    elevation: 0,
  });
}

export default function Navbar() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();
  const { activeLanguage, languageDispatch } = useLanguage();

  const navLinks: INavItem[] = [
    { route: '#features', title: 'features' },
    { route: '#clients', title: 'ourClients' },
    { route: '#how-it-works', title: 'howItWorks' },
    { route: '#pricing', title: 'pricing' },
    { route: '#faq', title: 'faq' },
    { route: '#contact-us', title: 'contactUs' },
  ];

  return (
    <Box
      component="nav"
      sx={{
        padding: '15px 119px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: 4,
        alignItems: 'center',
        justifyItems: 'start',
      }}
    >
      <Image
        className="main-logo"
        src="/lynkr_logo.png"
        alt="Lynkr logo"
        height={50}
        width={157.88}
        onClick={() => push('/')}
        style={{ cursor: 'pointer' }}
      />
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          columnGap: '40px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            columnGap: '40px',
            gridAutoFlow: 'column',
            alignItems: 'center',
          }}
        >
          {navLinks.map(({ title, route }, index) => (
            <NavItem
              title={formatMessage({ id: title })}
              route={route}
              key={index}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: '8px',
            alignItems: 'center',
          }}
        >
          <Tooltip
            arrow
            title={formatMessage({
              id: activeLanguage === 'en' ? 'changeToFr' : 'changeToEn',
            })}
          >
            <IconButton
              onClick={() =>
                languageDispatch({
                  type: activeLanguage === 'en' ? 'USE_FRENCH' : 'USE_ENGLISH',
                })
              }
            >
              <Icon icon={globe} fontSize={28} />
            </IconButton>
          </Tooltip>
          <Button variant="text" color="primary">
            {formatMessage({ id: 'offerBundle' })}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            className="color-body"
            sx={{
              border: `1px solid ${theme.common.line}`,
            }}
          >
            {formatMessage({ id: 'signIn' })}
          </Button>
          <Button variant="contained" color="primary">
            {formatMessage({ id: 'onboardMerchant' })}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
