import { ArrowDropDownRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  lighten,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme, useLanguage } from '@glom/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

interface navItem {
  item: string;
  route: string;
}

export default function Navbar() {
  const { formatMessage } = useIntl();
  const { activeLanguage, languageDispatch } = useLanguage();
  const { pathname, push } = useRouter();

  const navItems: navItem[] = [
    { item: 'product', route: '/' },
    { item: 'pricing', route: '/pricing' },
    { item: 'features', route: '/features' },
    { item: 'contactUs', route: '/contact' },
    { item: 'verifyDemandStatus', route: '/demand-status' },
  ];
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        justifyItems: 'center',
        padding: `${theme.spacing(1)} 7.1%`,
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
        columnGap: theme.spacing(2),
        color: theme.common.titleActive,
      }}
    >
      <Image src="/logo.png" alt="Squoolr icon" height="60%" width="60%" />
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(4),
        }}
      >
        {navItems.map(({ item, route }, index) => {
          return (
            <Typography
              key={index}
              sx={{
                position: 'relative',
                transition: '0.2s',
                '& a': {
                  textDecoration: 'none',
                  color: theme.common.titleActive,
                  ...theme.typography.body1,
                  fontWeight: 400,
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
                      route
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
                      `/${pathname.split('/').filter((_) => _ !== '')[0]}` ===
                        route
                        ? 'primary'
                        : 'secondary'
                    ].main,
                },
              }}
            >
              <Link href={route}>{formatMessage({ id: item })}</Link>
            </Typography>
          );
        })}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: 'none' }}
          onClick={() => push('/demand')}
        >
          {formatMessage({ id: 'createSchool' })}
        </Button>
        <Box>
          <IconButton
            onClick={() =>
              languageDispatch({
                type: activeLanguage === 'en' ? 'USE_FRENCH' : 'USE_ENGLISH',
              })
            }
          >
            <Typography>{activeLanguage}</Typography>
            <Tooltip arrow title={formatMessage({ id: 'swapLanguage' })}>
              <ArrowDropDownRounded />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
