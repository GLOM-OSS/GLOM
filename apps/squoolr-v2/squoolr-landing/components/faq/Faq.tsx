import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import FaqHeader from './FaqHeader';
import QuestionsSection from './QuestionsSection';

export default function Faq() {
  const { formatMessage } = useIntl();

  return (
    <Box
      component="section"
      id="faq"
      sx={{
        position: 'relative',
        padding: {
          mobile: '100px 0px 50px 0px',
          desktop: '170px 0px 0 0px',
        },
        display: 'grid',
        gap: 9,
      }}
    >
      <Box
        sx={{
          width: '170.433px',
          height: '2292px',
          transform: 'rotate(47.869deg)',
          position: 'absolute',
          left: '-282px',
          bottom: '-189.925px',
          borderRadius: '2292px',
          background:
            'linear-gradient(180deg, rgba(139, 60, 212, 0.62) 9.62%, rgba(11, 119, 219, 0.63) 75.73%)',
          filter: 'blur(300px)',
          display: { mobile: 'none', desktop: 'block' },
        }}
      />
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
          {formatMessage({ id: 'technologyForAllSchoolSizes' })}
        </Typography>
        <Typography className="p1--space" sx={{ textAlign: 'center' }}>
          {formatMessage({ id: 'technologyForAllSchoolSizesSubtitle' })}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', rowGap: 5, pb: 4 }}>
        <FaqHeader />
        <QuestionsSection />
      </Box>
    </Box>
  );
}
