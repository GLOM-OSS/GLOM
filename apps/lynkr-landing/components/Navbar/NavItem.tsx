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
  const { pathname } = useRouter();
  const theme = useTheme();

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
          width:
            pathname === route ||
            `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route
              ? '100%'
              : 0,
          backgroundColor: theme.palette.secondary.main,
          borderRadius: '5px',
        },
        '&:hover::before': {
          transition: '0.2s',
          width: '100%',
          backgroundColor:
            theme.palette[
              pathname === route ||
              `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route
                ? 'primary'
                : 'secondary'
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
