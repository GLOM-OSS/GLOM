import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ReviewLine({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  const theme = useTheme();
  const { formatDate } = useIntl();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'baseline',
        columnGap: 3,
      }}
    >
      <Typography className="p2--space">{title}</Typography>
      <Typography
        className="p2--space"
        sx={{ color: `${theme.common.titleActive} !important` }}
      >
        {title.toLowerCase().includes('date') ||
        title.toLowerCase().includes('s_at')
          ? formatDate(value, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              weekday: 'short',
            })
          : value}
      </Typography>
    </Box>
  );
}
