import { useLanguage } from '@glom/theme';
import globe from '@iconify/icons-fluent/globe-48-regular';
import navigation from '@iconify/icons-fluent/navigation-20-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { INavItem } from './NavItem';
import { SideNav } from './SideNav';

export default function MobileNav({ navLinks }: { navLinks: INavItem[] }) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const { activeLanguage, languageDispatch } = useLanguage();

  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);

  return (
    <>
      <SideNav
        close={() => setIsSideNavOpen(false)}
        navLinks={navLinks}
        open={isSideNavOpen}
      />
      <Box
        sx={{
          padding: '5px 26px',
          display: { mobile: 'grid', desktop: 'none' },
          alignItems: 'center',
          gridTemplateColumns: 'auto 1fr auto',
          justifyItems: 'center',
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'menu' })}>
          <IconButton onClick={() => setIsSideNavOpen(true)}>
            <Icon icon={navigation} />
          </IconButton>
        </Tooltip>
        <Image
          className="main-logo"
          src="/lynkr_logo.png"
          alt="Lynkr logo"
          height={36}
          width={121}
          onClick={() => push('/')}
          style={{ cursor: 'pointer' }}
        />
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
      </Box>
    </>
  );
}
