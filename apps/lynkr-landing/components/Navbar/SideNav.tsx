import { useTheme } from '@glom/theme';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { INavItem, NavItem } from './NavItem';

export function SideNav({
  open,
  close,
  navLinks,
}: {
  close: () => void;
  open: boolean;
  navLinks: INavItem[];
}) {
  const { push } = useRouter();

  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={close}
      sx={{
        '& .MuiPaper-root': {
          padding: '40px 41px 21px 41px',
          borderRadius: 0,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          alignItems: 'end',
          rowGap: 4,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            rowGap: '45px',
            justifyItems: 'start',
          }}
        >
          <Image
            src="/lynkr_logo.png"
            alt="lynkr logo"
            height={36}
            width={121}
          />
          <Box
            sx={{
              display: 'grid',
              rowGap: '40px',
              alignContent: 'start',
              justifySelf: 'start',
            }}
          >
            {navLinks.map(({ title, route }, index) => (
              <NavItem
                handleLink={() => {
                  push(route);
                  close();
                }}
                title={formatMessage({ id: title })}
                route={route}
                key={index}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            rowGap: '24px',
          }}
        >
          <Box sx={{ display: 'grid', rowGap: '8px' }}>
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
          <Box
            sx={{
              display: 'grid',
              justifyItems: 'center',
              justifySelf: 'center',
              rowGap: '8px',
            }}
          >
            <Image
              src="/lynkr_word_logo.png"
              alt="lynkr logo"
              width={79}
              height={18}
            />
            <Typography className="label2" sx={{ color: theme.common.label }}>
              {formatMessage({ id: 'byGLOM' })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
