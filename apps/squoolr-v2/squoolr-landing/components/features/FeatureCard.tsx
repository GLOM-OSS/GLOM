import { useTheme } from '@glom/theme';
import { Box, Button, Fade, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { IFeature } from './Features';

export default function FeatureCard({
  feature: { description, image, isComingSoon, title },
  isActive,
}: {
  feature: IFeature;
  isActive: boolean;
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Fade in={isActive} style={{ transitionDelay: isActive ? '300ms' : '0ms' }}>
      <Box
        sx={{
          display: isActive ? 'grid' : 'none',
          gridTemplateColumns: { mobile: '1fr', laptop: '1fr auto' },
          gap: 1,
          justifyItems: 'end',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            rowGap: '32px',
            alignItems: 'start',
            alignSelf: 'center',
            justifySelf: 'start',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { mobile: '1fr', laptop: '1fr auto' },
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <Typography
              className="title2-landing-page"
              sx={{ color: `${theme.common.titleActive} !important` }}
            >
              {title}
            </Typography>

            {isComingSoon && (
              <Typography
                sx={{
                  padding: { mobile: '4px 16px', laptop: '8px 32px' },
                  backgroundColor: '#F0E82A',
                  color: theme.common.titleActive,
                  borderRadius: 100,
                  fontWeight: 700,
                  justifySelf: 'start',
                }}
              >
                {formatMessage({ id: 'comingSoon' })}
              </Typography>
            )}
          </Box>
          <Typography
            className="p1--space"
            sx={{
              color: `${theme.common.label} !important`,
              textAlign: 'justify',
            }}
          >
            {description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ justifySelf: 'start' }}
          >
            {formatMessage({ id: 'getEarlyAccess' })}
          </Button>
        </Box>
        <img
          data-aos-duration={1000}
          data-aos={'fade-left'}
          src={image}
          alt="more"
          style={{ alignSelf: 'center', width: '100%' }}
        />
      </Box>
    </Fade>
  );
}
