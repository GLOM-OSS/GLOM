import { Box, Button, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import useNotification from './notification';

export const ErrorMessage = ({
  retryFunction,
  notification,
  message,
}: {
  retryFunction: () => void;
  notification: useNotification;
  message: string;
}) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="caption">{message}</Typography>
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        justifyItems: 'center',
        marginTop: '10px',
      }}
    >
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={() => {
          retryFunction();
          notification.dismiss();
        }}
        sx={{ ...theme.typography.caption }}
      >
        Retry
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={() => notification.dismiss()}
        sx={{
          ...theme.typography.caption,
          backgroundColor: theme.palette.error.dark,
          transition: '0.3s',
          '&:hover': {
            backgroundColor: theme.palette.error.main,
            transition: '0.3s',
          },
        }}
      >
        Close
      </Button>
    </Box>
  </Box>
);

export default ErrorMessage;
