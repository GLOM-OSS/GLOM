import { Box, Button, Typography } from '@mui/material';
import { injectIntl, IntlShape } from 'react-intl';
export function Index({ intl: { formatMessage } }: { intl: IntlShape }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'Poppins' }}>Hello world</Typography>
      <Typography sx={{ fontFamily: 'Roboto' }}>Hello world</Typography>
      <Button color="secondary" variant="contained">
        {formatMessage({ id: 'worldText' })}
      </Button>
    </Box>
  );
}

export default injectIntl(Index);
