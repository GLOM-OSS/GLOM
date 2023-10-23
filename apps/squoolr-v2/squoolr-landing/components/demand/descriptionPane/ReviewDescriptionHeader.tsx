import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ReviewDescriptionHeader({
  referral_code,
  onboarding_fee,
}: {
  referral_code: string;
  onboarding_fee: number;
}) {
  const theme = useTheme();
  const { formatMessage, formatNumber } = useIntl();

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        paddingBottom: 0.5,
      }}
    >
      <Typography variant="h3" sx={{ color: theme.common.body, padding: 0 }}>
        {formatNumber(referral_code ? 0 : onboarding_fee, {
          style: 'currency',
          currency: 'xaf',
        })}
      </Typography>
      <Typography
        className="p2"
        sx={{ color: theme.common.body, fontWeight: '400 !important' }}
      >
        {formatMessage({ id: 'setupFee' })}
      </Typography>
    </Box>
  );
}
