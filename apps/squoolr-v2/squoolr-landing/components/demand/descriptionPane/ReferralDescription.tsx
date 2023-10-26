import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ReferralDescription({
  onboarding_fee,
}: {
  onboarding_fee: number;
}) {
  const theme = useTheme();
  const { formatMessage, formatNumber } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        alignItems: 'end',
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
        {formatMessage({ id: 'ambassadorDescription' })}
        <Typography
          component="span"
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.common.titleActive,
            lineHeight: '24px',
          }}
        >
          {` ${formatMessage({
            id: 'ambassadorDescriptionFee',
          })} ${formatNumber(onboarding_fee, {
            style: 'currency',
            currency: 'xaf',
          })}.`}
        </Typography>
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 400,
          color: theme.common.label,
          lineHeight: '24px',
          textAlign: 'justify',
        }}
      >
        {formatMessage({id:'toFindAmbassadorsVisit'})}
        <Typography
          variant="h5"
          component="a"
          href="https://ambassadors.squoolr.com"
          target="_blank"
          sx={{
            fontWeight: 400,
            color: theme.palette.primary.main,
            lineHeight: '24px',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {' ambassadors.squoolr.com '}
        </Typography>
        {formatMessage({id:'andGetStarted'})}
      </Typography>
    </Box>
  );
}
