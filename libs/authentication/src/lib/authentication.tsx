import { Box, Button, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { IntlShape } from 'react-intl';

export function Authentication({
  intl: { formatMessage },
  user,
}: {
  intl: IntlShape;
  user: string;
}) {
  return (
    <Box>
      <Typography sx={{ color: theme.palette.primary.main }}>
        Hello world {user}👋
      </Typography>
      <Button variant="contained" color="secondary">
        {formatMessage({ id: 'worldText' })}
      </Button>
    </Box>
  );
}

export default Authentication;