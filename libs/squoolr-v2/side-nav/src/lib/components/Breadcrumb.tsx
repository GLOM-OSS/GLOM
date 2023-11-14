import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import {
  useBreadcrumb,
  useDispatchBreadcrumb,
} from '../breadcrumbContext/BreadcrumbContextProvider';
import { IBreadcrumbItem } from '../breadcrumbContext/BreadcrumbContext';

function BreadcrumbItem({
  value: { route, title },
  hasSlash,
  colored,
}: {
  value: IBreadcrumbItem;
  hasSlash: boolean;
  colored: boolean;
}) {
  const { push } = useRouter();
  const theme = useTheme();
  const breadcrumbDispatch = useDispatchBreadcrumb();

  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 1,
        alignItems: 'center',
      }}
    >
      {hasSlash && (
        <Typography
          className="p4"
          sx={{ fontWeight: '400 !important', cursor: 'context-menu' }}
        >
          /
        </Typography>
      )}
      <Typography
        className="p4"
        sx={{
          fontWeight: '400 !important',
          color: colored
            ? `${theme.palette.primary.main} !important`
            : 'initial',
          cursor: typeof route !== 'undefined' ? 'pointer' : 'context-menu',
          '&:hover': {
            color: colored
              ? `${theme.palette.primary.main} !important`
              : typeof route !== 'undefined'
              ? `${theme.palette.primary.light} !important`
              : 'inherit',
          },
        }}
        onClick={() => {
          if (route) {
            breadcrumbDispatch({
              action: 'MOVE',
              payload: [{ route, title: '' }],
            });
            push(`/${route}`);
          }
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function Breadcrumb() {
  const breadcrumbItems = useBreadcrumb();

  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'start',
        gridAutoFlow: 'column',
        columnGap: 1,
      }}
    >
      {breadcrumbItems.map((item, index) => (
        <BreadcrumbItem
          hasSlash={index !== 0}
          key={index}
          value={item}
          colored={index === breadcrumbItems.length - 1}
        />
      ))}
    </Box>
  );
}
