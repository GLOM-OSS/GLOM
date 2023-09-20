import { Box, Skeleton, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';

export default function QuestionSkeleton() {
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        paddingBottom: 1,
        marginBottom: theme.spacing(2),
      }}
    >
      <Box>
        <Typography>
          <Skeleton animation="wave" />
        </Typography>
        <Typography>
          <Skeleton animation="wave" sx={{ width: '70%' }} />
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: 'start',
          columnGap: theme.spacing(1),
        }}
      >
        <Skeleton
          variant="rectangular"
          width={100}
          height={100}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={100}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: 'start',
          columnGap: theme.spacing(1),
        }}
      >
        <Skeleton animation="wave" height={20} width={60} />
        <Skeleton animation="wave" height={20} width={60} />
        <Skeleton animation="wave" height={20} width={60} />
        <Skeleton animation="wave" height={20} width={60} />
      </Box>
    </Box>
  );
}
