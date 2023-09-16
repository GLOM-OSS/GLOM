import { Box, lighten, Typography } from '@mui/material';
import { IPaymentHistory } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function PaymentCard({
  payment: { payment_reason: pr, payment_date: pd, amount },
}: {
  payment: IPaymentHistory;
}) {
  const { formatDate, formatNumber } = useIntl();
  return (
    <Box
      sx={{
        backgroundColor: lighten(
          theme.palette[
            pr === 'Fee' ? 'primary' : pr === 'Platform' ? 'secondary' : 'error'
          ].main,
          0.93
        ),
        borderRadius: 2,
        padding: 1,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: lighten(
            theme.palette[
              pr === 'Fee'
                ? 'primary'
                : pr === 'Platform'
                ? 'secondary'
                : 'error'
            ].main,
            0.85
          ),
        },
      }}
    >
      <Typography variant="h6" textAlign="center">
        {pr}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 1,
          alignItems: 'center',
          padding: `0 ${theme.spacing(1)}`,
        }}
      >
        <Typography>
          {formatDate(pd, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })}
        </Typography>
        <Typography>
          {formatNumber(amount, {
            style: 'currency',
            currency: 'XAF',
          })}
        </Typography>
      </Box>
    </Box>
  );
}
