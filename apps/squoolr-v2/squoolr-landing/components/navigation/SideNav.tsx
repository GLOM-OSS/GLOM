import { useTheme } from '@glom/theme';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { LogoHolder } from './Navbar';
import NavItem from './NavItem';

interface INavItem {
  item: string;
  route: string;
}

export function SideNav({
  open,
  close,
  navItems,
  openContactUs,
}: {
  close: () => void;
  open: boolean;
  navItems: INavItem[];
  openContactUs: () => void;
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
          padding: '16px 41px',
          width: {
            mobile: '70vw',
            tablet: '40vw',
            desktop: '240px',
          },
          maxWidth: '240px',
          borderRadius: 0,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: 4,
        }}
      >
        <Box onClick={() => close()}>
          <LogoHolder size={52} />
        </Box>

        <Box
          sx={{
            height: '100%',
            gridTemplateRows: '1fr auto',
            display: 'grid',
            rowGap: 2,
            justifyItems: 'left',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              rowGap: theme.spacing(4),
              alignContent: 'start',
              justifySelf: 'stretch',
            }}
          >
            {navItems.map(({ item, route }, index) => (
              <NavItem
                handleLink={() => {
                  push(route);
                  close();
                }}
                item={formatMessage({ id: item })}
                route={route}
                key={index}
              />
            ))}
            <NavItem
              item={formatMessage({ id: 'contactUs' })}
              route="ttt"
              handleLink={() => {
                close();
                openContactUs();
              }}
            />
          </Box>
          <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: '26px' }}>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                justifyItems: 'center',
              }}
            >
              <Button variant="text" color="primary" size="small">
                {formatMessage({ id: 'verifyDemandStatus' })}
              </Button>
              <Button variant="contained" color="primary">
                {formatMessage({ id: 'getEarlyAccess' })}
              </Button>
            </Box>
            <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: 1 }}>
              <Typography variant="h5" sx={{ pb: 0 }}>
                SQUOOLR
              </Typography>
              <Typography className="label2" sx={{ color: theme.common.label }}>
                {formatMessage({ id: 'byGLOM' })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
