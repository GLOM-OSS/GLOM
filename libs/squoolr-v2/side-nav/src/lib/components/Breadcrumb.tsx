import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '../breadcrumbContext/BreadcrumbContextProvider';
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

  return (
    <>
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
        }}
        onClick={() => (route ? push(route) : null)}
      >
        {title}
      </Typography>
    </>
  );
}

export default function Breadcrumb() {
  const breadcrumbItems = useBreadcrumb();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto auto auto 1fr',
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
