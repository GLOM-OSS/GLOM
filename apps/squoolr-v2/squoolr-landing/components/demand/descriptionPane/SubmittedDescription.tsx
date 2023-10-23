import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function SubmittedDescription() {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        alignItems: 'start',
        rowGap: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 400,
          color: theme.common.label,
          lineHeight: '24px',
          textAlign: 'justify',
        }}
      >
        {formatMessage({ id: 'demandEmailSent' })}
        <Typography
          component="span"
          variant="h5"
          sx={{
            lineHeight: '24px',
            fontWeight: 400,
          }}
        >
          {formatMessage({ id: 'demandTreatmentDelay' })}
        </Typography>
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 400,
          color: theme.common.label,
          lineHeight: '24px',
        }}
      >
        {formatMessage({ id: 'checkYourDemandStatus' })}
        <Typography
          variant="h5"
          component="a"
          href="/?status=true"
          sx={{
            fontWeight: 400,
            color: theme.palette.primary.main,
            lineHeight: '24px',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {' squoolr.com/?status=true '}
        </Typography>
      </Typography>
    </Box>
  );
}
