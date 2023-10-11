import { Box, Button, Typography } from '@mui/material';
import arrowRight from '@iconify/icons-fluent/arrow-right-48-regular';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useIntl } from 'react-intl';

export default function Hero() {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        position: 'relative',
        padding: {
          mobile: '170px 16px',
          desktop: '170px 16px 0 16px',
        },
        display: 'grid',
        gridTemplateColumns: '0.4fr 1fr',
        alignItems: 'start',
        columnGap: 3,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 4,
            position: 'absolute',
            left: 0,
            top: '90px',
          }}
        >
          <Typography
            className="title-landing-page"
            sx={{ color: 'var(--titleActive)', textAlign: 'start !important' }}
          >
            {formatMessage({ id: 'unlockYourInstitutionsPotential' })}
          </Typography>
          <Typography className="p1--space">
            {formatMessage({ id: 'squoolrLandingSubtitle' })}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            endIcon={<Icon icon={arrowRight} />}
          >
            {formatMessage({ id: 'getEarlyAccessNow' })}
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: '100%' }}>
        <img
          src="/hero_image.png"
          style={{
            marginTop: '-40px',
            width: '100%',
          }}
        />
      </Box>
      <Button
        variant="outlined"
        color="primary"
        endIcon={<Icon icon={arrowRight} rotate={1} />}
        sx={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'floatAndBounce 3s infinite',
          '@keyframes floatAndBounce': {
            '0%, 100%': {
              transform: 'translate(-50%, -50%)',
            },
            '50%': {
              transform: 'translate(-50%, -30px)',
            },
          },
        }}
      >
        {formatMessage({ id: 'scrollToSeeMore' })}
      </Button>
    </Box>
  );
}
