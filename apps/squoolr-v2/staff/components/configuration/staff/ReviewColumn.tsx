import { Box, Typography } from '@mui/material';
import ReviewLine from './ReviewLine';
import { useIntl } from 'react-intl';
import { useTheme } from '@glom/theme';

export default function ReviewColumn({
  data,
  order,
  title,
}: {
  data: Object;
  order: string[];
  title: string;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        rowGap: 3,
        alignContent: 'start',
        justifyItems: 'start',
      }}
    >
      <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
        {title}
      </Typography>
      <Box sx={{ display: 'grid', justifyItems: 'start', rowGap: 2 }}>
        {order.map((key, index) => (
          <ReviewLine
            key={index}
            title={formatMessage({ id: key })}
            value={data[key]}
          />
        ))}
      </Box>
    </Box>
  );
}
