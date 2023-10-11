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
          mobile: '100px 16px',
          desktop: '170px 16px 0 16px',
        },
        display: 'grid',
        gridTemplateColumns: { desktop: '0.4fr 1fr', mobile: '1fr' },
        alignItems: 'start',
        gap: 3,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: { mobile: 2, desktop: 4 },
            position: { desktop: 'absolute', mobile: 'initial' },
            left: 0,
            top: '90px',
            justifyContent: { desktop: 'stretch', mobile: 'center' },
          }}
        >
          <Typography
            className="title-landing-page"
            sx={{
              color: 'var(--titleActive)',
              textAlign: { mobile: 'initial', desktop: 'start !important' },
            }}
          >
            {formatMessage({ id: 'unlockYourInstitutionsPotential' })}
          </Typography>
          <Typography
            className="p1--space"
            sx={{
              textAlign: { mobile: 'center', desktop: 'initial' },
              width: { mobile: '80%', desktop: 'initial' },
              justifySelf: { mobile: 'center', desktop: 'initial' },
            }}
          >
            {formatMessage({ id: 'squoolrLandingSubtitle' })}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            endIcon={<Icon icon={arrowRight} />}
            sx={{ justifySelf: { mobile: 'center', desktop: 'initial' } }}
          >
            {formatMessage({ id: 'getEarlyAccessNow' })}
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: '100%' }}>
        <Box
          component="img"
          src="/hero_image.png"
          sx={{
            marginTop: { mobile: 0, desktop: '-40px' },
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
          bottom: { mobile: 0, desktop: '70px' },
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
