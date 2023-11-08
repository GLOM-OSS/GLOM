import { useTheme } from '@glom/theme';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { determinePhoneNetworkLogo, validatePhoneNumber } from '@glom/utils';
import Image from 'next/image';
import { useIntl } from 'react-intl';

export default function ReviewDescription({
  payingPhone,
  setPayingPhone,
  referral_code,
  isSubmitting,
}: {
  payingPhone: string;
  setPayingPhone: (phone: string) => void;
  referral_code: string;
  isSubmitting: boolean;
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
      {referral_code ? (
        <Typography
          variant="h3"
          sx={{ color: theme.common.body }}
        >{`${formatMessage({
          id: 'ambassadorCode',
        })}: ${referral_code}`}</Typography>
      ) : (
        <TextField
          disabled={isSubmitting}
          InputProps={{
            startAdornment: (
              <Typography variant="body1" mr={1}>
                (+237)
              </Typography>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {payingPhone && (
                  <Image
                    src={determinePhoneNetworkLogo(payingPhone)}
                    height="32"
                    width="32"
                    alt="MTN mobile money Logo"
                  />
                )}
              </InputAdornment>
            ),
          }}
          fullWidth
          required
          size="small"
          value={payingPhone}
          placeholder={formatMessage({ id: 'payingPhone' })}
          onChange={(e) => setPayingPhone(e.target.value)}
          error={validatePhoneNumber(payingPhone) === -1}
        />
      )}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 400,
          color: theme.common.label,
          lineHeight: '24px',
          marginTop: 2,
        }}
      >
        <Typography
          component="span"
          variant="h5"
          sx={{
            color: theme.common.titleActive,
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          {formatMessage({ id: 'getFeeFreeJourney' })}
        </Typography>
        {` ${formatMessage({ id: 'connectWithAmbassadorsAt' })} `}
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
          {'ambassadors.squoolr.com'}
        </Typography>
      </Typography>
    </Box>
  );
}
