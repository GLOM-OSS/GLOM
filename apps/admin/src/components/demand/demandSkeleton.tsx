import { Box, Skeleton, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';

export default function DemandSkeleton() {
  return (
    <Box
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
        display: 'grid',
        columnGap: theme.spacing(10),
        gridTemplateColumns: '100px 1fr 1fr 1fr 8ch',
        borderRadius: theme.spacing(1),
        alignItems: 'center',
      }}
    >
      {[...new Array(5)].map((_, index) => (
        <Typography key={index}>
          <Skeleton />
        </Typography>
      ))}
    </Box>
  );
}
