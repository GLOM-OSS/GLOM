import { usePlatformSettings } from '@glom/data-access/squoolr';
import { useTheme } from '@glom/theme';
import check from '@iconify/icons-fluent/checkmark-48-filled';
import { Icon } from '@iconify/react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

export default function Pricing() {
  const theme = useTheme();
  const { formatMessage, formatNumber } = useIntl();
  const { push } = useRouter();

  const { data: platformSettings } = usePlatformSettings();

  return (
    <Box
      sx={{
        mt: '103px',
        display: 'grid',
        rowGap: '35px',
        justifyContent: 'center',
        justifyItems: 'center',
        padding: '0 16px 16px 16px',
      }}
    >
      <Box sx={{ display: 'grid', rowGap: 2, justifyItems: 'center' }}>
        <Typography
          className="title-landing-page"
          sx={{ color: `${theme.common.titleActive} !important` }}
        >
          {formatMessage({ id: 'ourPricing' })}
        </Typography>
        <Typography
          className="p2--space"
          sx={{
            textAlign: 'center !important',
            width: { mobile: '100%', laptop: '70%' },
          }}
        >
          {formatMessage({ id: 'ourPricingSubtitle' })}
        </Typography>
      </Box>

      <Box
        sx={{
          padding: { mobile: '18px 28px', laptop: '36px 56px' },
          borderRadius: '8px',
          border: `1px solid ${theme.common.line}`,
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { mobile: '1fr', laptop: 'auto 1fr' },
        }}
      >
        <Box sx={{ display: 'grid', rowGap: 2 }}>
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography
              variant="h2"
              sx={{ color: `${theme.common.titleActive} !important` }}
            >
              {formatMessage({ id: 'freeForInstitutions' })}
            </Typography>
            <Typography
              className="p2"
              sx={{ maxWidth: { mobile: '100%', laptop: '300px' } }}
            >
              {formatMessage({ id: 'freeForInstitutionsSubtitle' })}
            </Typography>
            <Chip
              label={formatMessage({ id: 'allFunctionalities' })}
              color="success"
              className="p3--space"
              sx={{
                backgroundColor: '#DCFCE7',
                color: `${theme.palette.success.main} !important`,
                fontWeight: 400,
                borderRadius: '4px',
              }}
            />
          </Box>
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography
              className="p4"
              sx={{ color: `${theme.common.titleActive} !important` }}
            >
              {formatMessage({ id: 'studentsPay' })}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto auto 1fr',
                alignItems: 'center',
              }}
            >
              <Typography
                className="title-landing-page"
                sx={{ color: `${theme.common.titleActive} !important` }}
              >
                {platformSettings &&
                  formatNumber(platformSettings?.platform_fee)}
              </Typography>
              <Typography
                className="p1"
                sx={{ color: `${theme.common.titleActive} !important` }}
              >
                FCFA
              </Typography>
            </Box>
            <Typography className="p3">
              {formatMessage({ id: 'perSemesterForPlatformFee' })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => push('/demand')}
          >
            {formatMessage({ id: 'onboardNow' })}
          </Button>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 2.5, mt: 2, alignSelf: 'start' }}>
          <Typography
            className="p1"
            sx={{ color: `${theme.common.titleActive} !important` }}
          >
            {formatMessage({ id: 'functionalitiesInclude' })}
          </Typography>
          <Box sx={{ display: 'grid', rowGap: 3 }}>
            {[
              'studentRegistration',
              'feePayment',
              'markManagement',
              'courseManagement',
              'disciplineManagement',
              'parentsPlatform',
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto 1fr',
                  alignItems: 'center',
                  columnGap: 1,
                }}
              >
                <Icon
                  icon={check}
                  color={theme.common.titleActive}
                  height={20}
                  width={20}
                />
                <Typography
                  className="p3"
                  sx={{ color: `${theme.common.titleActive} !important` }}
                >
                  {formatMessage({ id: feature })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
