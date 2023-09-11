import { Skeleton, Typography } from '@mui/material';

export default function DetailLine({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <Typography
      sx={{
        display: isLoading ? 'grid' : 'initial',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 0.5,
      }}
    >
      <Typography component="span" fontWeight={300}>
        {`${title} : `}
      </Typography>
      <Typography component="span" fontWeight={500}>
        {isLoading ? <Skeleton animation="wave" component="span" /> : value}
      </Typography>
    </Typography>
  );
}
