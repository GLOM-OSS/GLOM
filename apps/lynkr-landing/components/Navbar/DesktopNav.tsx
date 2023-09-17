import { useLanguage } from '@glom/theme';
import globe from '@iconify/icons-fluent/globe-48-regular';
import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { INavItem, NavItem } from './NavItem';

export default function DesktopNav({ navLinks }: { navLinks: INavItem[] }) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const { activeLanguage, languageDispatch } = useLanguage();

  return (
    <Box
      component="nav"
      sx={{
        padding: '15px 119px',
        display: {
          desktop: 'grid',
          mobile: 'none',
        },
        gridTemplateColumns: '157.88px 1fr',
        columnGap: 10,
        alignItems: 'center',
        justifyItems: 'end',
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
          <Button variant="outlined" color="inherit">
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
