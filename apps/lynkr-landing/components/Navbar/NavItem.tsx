import { Typography } from '@mui/material';
import { useTheme } from '@glom/theme';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface INavItem {
  route: string;
  title: string;
  handleLink?: () => void;
}

export function NavItem({ route, title, handleLink }: INavItem) {
  const { pathname, asPath: url } = useRouter();
  const theme = useTheme();

  const isSectionActive = url.split('/').filter((_) => _ !== '')[0] === route;
  const isRouteActive =
    pathname.split('/').filter((_) => _ !== '')[0] === route;

  return (
    <Typography
      className="label1"
      sx={{
        color: theme.common.body,
        position: 'relative',
        transition: '0.2s',
        cursor: 'pointer',
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
          width: isRouteActive || isSectionActive ? '100%' : 0,
          backgroundColor: theme.palette.primary.main,
          borderRadius: '5px',
        },
        '&:hover::before': {
          transition: '0.2s',
          width: '100%',
          backgroundColor:
            theme.palette[
              isRouteActive || isSectionActive ? 'secondary' : 'primary'
            ].main,
        },
      }}
    >
      <Link href={route}>
        <span
          onClick={(e) => {
            if (handleLink) {
              e.preventDefault();
              handleLink();
            }
          }}
        >
          {title}
        </span>
      </Link>
    </Typography>
  );
}
