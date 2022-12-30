import { Box, Chip, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function PendingAnonimation() {
  const { formatMessage } = useIntl();
  return (
    <Box>
      <Typography>
        {formatMessage({ id: 'pendingAnonimationMessage' })}
      </Typography>
      <Chip
        label={formatMessage({ id: 'pendingAnomimation' })}
        sx={{ backgroundColor: lighten(theme.palette.error.main, 0.6) }}
      />
    </Box>
  );
}
