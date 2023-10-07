import { Box, Typography } from '@mui/material';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function NoCyclesAvailables() {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 300, color: theme.common.placeholder }}
      >
        {formatMessage({ id: 'noCyclesAvailable' })}
        {/*TODO: message: No cycles available yet. ask your system admin to configure majors */}
      </Typography>
    </Box>
  );
}
