import { useTheme } from '@glom/theme';
import { Icon } from '@iconify/react';
import { Box, Button, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import rightIcon from '@iconify/icons-fluent/arrow-right-24-regular';
import arrowCurveDownLeft from '@iconify/icons-fluent/arrow-curve-down-left-24-regular';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function HeroSection() {
  const theme = useTheme();
  const { push } = useRouter();
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        background:
          'url("hero_bg.png"),radial-gradient(70.71% 70.71% at 50% 50%, #DADBDB 0%, rgba(218, 219, 219, 0.50) 14.26%, rgba(218, 219, 219, 0.00) 31%), radial-gradient(70.71% 70.71% at 50% 50%, #DDDCDC 0%, rgba(221, 220, 220, 0.50) 17.5%, rgba(221, 220, 220, 0.00) 35%), radial-gradient(70.71% 70.71% at 50% 50%, #D7D6D6 0%, rgba(215, 214, 214, 0.50) 21%, rgba(215, 214, 214, 0.00) 35%), radial-gradient(70.71% 70.71% at 50% 50%, #FFF 0%, rgba(255, 255, 255, 0.50) 32.5%, rgba(255, 255, 255, 0.00) 65%), radial-gradient(70.71% 70.71% at 50% 50%, #F4F4F4 0%, rgba(244, 244, 244, 0.50) 15.66%, rgba(244, 244, 244, 0.00) 29%), radial-gradient(70.71% 70.71% at 50% 50%, #DADBDB 0%, rgba(218, 219, 219, 0.50) 31.02%, rgba(218, 219, 219, 0.00) 47%), radial-gradient(70.71% 70.71% at 50% 50%, #DDDCDC 0%, rgba(221, 220, 220, 0.50) 31.45%, rgba(221, 220, 220, 0.00) 37%), radial-gradient(70.71% 70.71% at 50% 50%, #F4F4F4 0%, rgba(244, 244, 244, 0.50) 100%, rgba(244, 244, 244, 0.00) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        paddingTop: '54px',
        paddingBottom: '16px',
        display: 'grid',
        justifyItems: 'center',
        alignContent: 'start',
        rowGap: '16px',
      }}
    >
      <Box sx={{ display: 'grid', rowGap: '32px', justifyItems: 'center' }}>
        <Box
          sx={{
            maxWidth: {
              desktop: '52.6%',
              mobile: '76.7%',
            },
            display: 'grid',
            rowGap: '16px',
            alignSelf: 'start',
            justifyItems: 'center',
          }}
        >
          <Typography
            className="title-landing-page"
            sx={{ color: theme.common.titleActive }}
          >
            {formatMessage({ id: 'projectHeadline' })}
          </Typography>
          <Typography className="p1--space" textAlign="center">
            {formatMessage({ id: 'projectSubtitle' })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<Icon icon={rightIcon} />}
            sx={{
              display: {
                mobile: 'none',
                deskotp: 'block',
              },
            }}
          >
            {formatMessage({ id: 'onboardMerchantNow' })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<Icon icon={rightIcon} />}
          >
            {formatMessage({ id: 'onboardMerchantNow' })}
          </Button>
        </Box>
        <Box sx={{ display: { desktop: 'block', mobile: 'none' } }}>
          <Image src="/hero.png" alt="hero image" width={1100} height={459} />
        </Box>
        <Box sx={{ display: { desktop: 'none', mobile: 'block' } }}>
          <Image
            src="/hero_mobile.png"
            alt="hero image"
            width={336}
            height={245.53}
          />
        </Box>
      </Box>
      <Button
        variant="text"
        color="primary"
        size="large"
        endIcon={<Icon icon={arrowCurveDownLeft} />}
        onClick={() => push('#features')}
        sx={{ display: { desktop: 'block', mobile: 'none' } }}
      >
        {formatMessage({ id: 'seeMore' })}
      </Button>
    </Box>
  );
}
