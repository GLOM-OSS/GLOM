import { Box, Button, Typography } from '@mui/material';
import { Authentication } from '@squoolr/auth';
import { injectIntl, IntlShape } from 'react-intl';
export function Index({ intl: { formatMessage }, intl }: { intl: IntlShape }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'Poppins' }}>Hello world</Typography>
      <Typography sx={{ fontFamily: 'Roboto' }}>Hello world</Typography>
      <Button color="secondary" variant="contained">
        {formatMessage({ id: 'worldText' })}
      </Button>
      <Authentication intl={intl} user="Landing" />
    </Box>
  );
}

export default injectIntl(Index);
