import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function FeaturesHeader() {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        rowGap: 1,
        justifyItems: 'center',
        justifySelf: 'center',
        padding: '0 16px',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { desktop: '36px', mobile: '30px' },
          lineHeight: { desktop: '44px', mobile: '36px' },
          letterSpacing: { desktop: '-0.72px', mobile: '-0.6px' },
          textAlign: 'center',
        }}
      >
        {formatMessage({ id: 'ourComprehensiveSolution' })}
      </Typography>
      <Typography className="p1--space" sx={{ textAlign: 'justify' }}>
        {formatMessage({ id: 'ourComprehensiveSolutionSubtitle' })}
      </Typography>
    </Box>
  );
}
