import { Box, lighten, Skeleton, Typography } from '@mui/material';
import { theme } from '@glom/theme';

export default function StatCard({
  title,
  value,
  skeleton,
}: {
  title: string;
  value?: string;
  skeleton: boolean;
}) {
  return (
    <Box
      sx={{
        backgroundColor: lighten(theme.palette.primary.main, 0.85),
        padding: theme.spacing(1),
        borderRadius: 3,
        display: 'grid',
        justifyItems: 'center',
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, textTransform: 'uppercase' }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: '200', marginTop: theme.spacing(1) }}
      >
        {skeleton || !value ? <Skeleton animation="wave" width={100} /> : value}
      </Typography>
    </Box>
  );
}
