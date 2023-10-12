import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function Partner() {
  const { formatMessage } = useIntl();

  return (
    <Box
      component="section"
      id="partners"
      sx={{
        padding: {
          mobile: '100px 16px',
          desktop: '170px 16px 32px 16px',
        },
        display: 'grid',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: 'white',
      }}
    >
      <Box sx={{ display: 'grid', rowGap: 1, justifyItems: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { desktop: '36px', mobile: '30px' },
            lineHeight: { desktop: '44px', mobile: '36px' },
            letterSpacing: { desktop: '-0.72px', mobile: '-0.6px' },
          }}
        >
          {formatMessage({ id: 'theyTrustUs' })}
        </Typography>
        <Typography className="p1--space">
          {formatMessage({ id: 'partnerSectionSubtitle' })}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', justifyContent: 'center' }}>
        <img src="/sajohim_logo.png" alt="sajohim" height={115} />
      </Box>
    </Box>
  );
}
