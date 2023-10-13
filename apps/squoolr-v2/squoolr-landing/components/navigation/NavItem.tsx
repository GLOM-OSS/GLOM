import { useTheme } from '@glom/theme';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function NavItem({
  route,
  item,
  handleLink,
}: {
  route: string;
  item: string;
  handleLink: () => void;
}) {
  const { pathname, asPath } = useRouter();
  const theme = useTheme();

  return (
    <Typography
      onClick={(e) => {
        e.preventDefault();
        handleLink();
      }}
      sx={{
        position: 'relative',
        transition: '0.2s',
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
            `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route ||
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
              `/${pathname.split('/').filter((_) => _ !== '')[0]}` === route ||
              asPath.includes(route)
                ? 'secondary'
                : 'primary'
            ].main,
        },
      }}
    >
      <Typography
        component="span"
        className="p3"
        sx={{
          color: 'var(--body)',
          letterSpacing: '0.6px',
          fontSize: '12px !important',
        }}
      >
        {item}
      </Typography>
    </Typography>
  );
}
