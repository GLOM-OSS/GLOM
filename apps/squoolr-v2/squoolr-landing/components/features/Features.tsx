import { useTheme } from '@glom/theme';
import left from '@iconify/icons-fluent/arrow-left-20-filled';
import { Icon } from '@iconify/react';
import { Box, Divider, IconButton, Tooltip, lighten } from '@mui/material';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FeatureCard from './FeatureCard';
import FeaturesHeader from './FeaturesHeader';

export interface IFeature {
  title: string;
  isComingSoon: boolean;
  description: string;
  image: string;
}

export default function Features({
  openEarlyAccess,
}: {
  openEarlyAccess: () => void;
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [activeCard, setActiveCard] = useState<number>(1);

  const features: IFeature[] = [
    {
      description: formatMessage({ id: 'courseManagementDescription' }),
      image: 'course_management.svg',
      isComingSoon: true,
      title: formatMessage({ id: 'courseManagement' }),
    },
    {
      description: formatMessage({
        id: 'gradingAndResultPublicationDescription',
      }),
      image: 'coming_soon.svg',
      isComingSoon: true,
      title: formatMessage({ id: 'gradingAndResultPublication' }),
    },
    {
      description: formatMessage({
        id: 'configurationsDescription',
      }),
      image: 'feature_configuration.svg',
      isComingSoon: true,
      title: formatMessage({ id: 'configurations' }),
    },
    {
      description: formatMessage({ id: 'andMoreFeaturesDescription' }),
      image: 'more.svg',
      isComingSoon: true,
      title: formatMessage({ id: 'andMoreFeatures' }),
    },
  ];

  const [animationKey, setAnimationKey] = useState(0);
  setTimeout(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, 12000);

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Initial screen width
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  return (
    <Box
      component="section"
      id="features"
      sx={{
        background: 'linear-gradient(0deg, #E7F0FF 0%, #FFF 100%)',
        padding: {
          mobile: '100px 0px 50px 0px',
          desktop: '170px 0px 55px 0px',
        },
        display: 'grid',
        gap: 5,
        overflow: 'hidden',
      }}
    >
      <FeaturesHeader />

      <Box
        sx={{
          padding: '0 16px',
          position: 'relative',
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            isActive={activeCard === index + 1}
            openEarlyAccess={openEarlyAccess}
          />
        ))}
        <Box
          key={animationKey}
          sx={{
            position: { mobile: 'initial', laptop: 'absolute' },
            bottom: {
              laptop: '50px',
              desktop: screenWidth >= 1550 ? '100px' : '40px',
            },

            animation: 'shake .9s cubic-bezier(.45,.05,.55,.95) .5s forwards',
            '@keyframes shake': {
              '0%': {
                transform: 'translateX(0)',
              },

              '25%': {
                transform: 'translateX(-12.5px)',
              },
              '50%': {
                transform: 'translateX(10px)',
              },
              '75%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(0)',
              },
            },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              alignItems: 'center',
              minWidth: '350px',
              rowGap: 1,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Divider
                sx={{
                  backgroundColor: lighten(theme.palette.secondary.light, 0.7),
                  height: '5px',
                  borderRadius: '1000px',
                }}
              />
              <Divider
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  height: '5px',
                  borderRadius: '1000px',
                  position: 'absolute',
                  bottom: 0,
                  left: -1,
                  transition: 'width .5s ease-in-out',
                  width: `${100 * (activeCard / features.length)}.5%`,
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                columnGap: 1,
                justifyContent: 'start',
              }}
            >
              <Tooltip arrow title={formatMessage({ id: 'previous' })}>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: lighten(
                      theme.palette.secondary.light,
                      0.7
                    ),
                  }}
                  onClick={() =>
                    setActiveCard((prev) => (prev === 1 ? 1 : prev - 1))
                  }
                >
                  <Icon icon={left} color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>

              <Tooltip arrow title={formatMessage({ id: 'next' })}>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: lighten(
                      theme.palette.secondary.light,
                      0.7
                    ),
                  }}
                  onClick={() =>
                    setActiveCard((prev) =>
                      prev === features.length ? features.length : prev + 1
                    )
                  }
                >
                  <Icon
                    icon={left}
                    rotate={2}
                    color={theme.palette.secondary.main}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
