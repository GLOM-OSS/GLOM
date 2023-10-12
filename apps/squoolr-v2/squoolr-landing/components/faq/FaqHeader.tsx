import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function FaqHeader() {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #437DF7 0%, #8950FE 100%)',
        padding: { mobile: '32px 16px', laptop: '70px 0' },
        display: 'grid',
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { desktop: '36px', mobile: '30px' },
          lineHeight: { desktop: '44px', mobile: '36px' },
          letterSpacing: { desktop: '-0.72px', mobile: '-0.6px' },
          textAlign: 'center',
          color: 'white',
        }}
      >
        {formatMessage({ id: 'frequentlyAskedQuestions' })}
      </Typography>
      <Typography
        className="p1--space"
        sx={{ textAlign: 'center', color: 'white !important' }}
      >
        {formatMessage({ id: 'frequentlyAskedQuestionsSubtitle' })}
      </Typography>
    </Box>
  );
}
