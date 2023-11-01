import { useVerifyAmbassador } from '@glom/data-access/squoolr';
import { SubmitSchoolDemandPayload } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export type IReferral = Pick<
  SubmitSchoolDemandPayload['school'],
  'lead_funnel' | 'referral_code'
>;

export default function ReferralInformation({
  data,
  onNext,
  onPrev,
  onboarding_fee,
}: {
  data: IReferral;
  onNext: (val: IReferral) => void;
  onPrev: () => void;
  onboarding_fee: number;
}) {
  const { formatMessage, formatNumber } = useIntl();
  const theme = useTheme();

  const validationSchema = Yup.object().shape({
    lead_funnel: Yup.string().required(formatMessage({ id: 'requiredField' })),
    referral_code: Yup.string(),
  });

  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: (values) => {
      if (!values.referral_code || (values.referral_code && isRefferalValid)) {
        onNext(values);
      }
    },
  });
  const { data: isRefferalValid } = useVerifyAmbassador(
    formik.values.referral_code
  );

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'grid', rowGap: 4, alignContent: 'start' }}
    >
      <Box sx={{ display: 'grid', rowGap: 2 }}>
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'HowDidYouHearAboutUs' })}
          placeholder={formatMessage({ id: 'HowDidYouHearAboutUs' })}
          variant="outlined"
          select
          error={
            formik.touched.lead_funnel && Boolean(formik.errors.lead_funnel)
          }
          helperText={formik.touched.lead_funnel && formik.errors.lead_funnel}
          {...formik.getFieldProps('lead_funnel')}
        >
          {['Facebook', 'Instagram', 'LinkedIn', 'friend', 'other'].map(
            (platform, index) => (
              <MenuItem key={index} value={platform}>
                {['friend', 'other'].includes(platform)
                  ? formatMessage({ id: platform })
                  : platform}
              </MenuItem>
            )
          )}
        </TextField>

        <Box sx={{ display: 'grid' }}>
          <TextField
            size="small"
            fullWidth
            label={formatMessage({ id: 'ambassadorCode' })}
            placeholder={formatMessage({ id: 'ambassadorCode' })}
            variant="outlined"
            error={
              formik.touched.referral_code &&
              Boolean(formik.errors.referral_code)
            }
            helperText={
              formik.touched.referral_code && formik.errors.referral_code
            }
            {...formik.getFieldProps('referral_code')}
          />
          <Typography
            className="p3--space"
            variant="body2"
            sx={{
              color: `${theme.palette.primary.main} !important`,
              justifySelf: 'end',
              marginRight: 1,
            }}
          >
            {`${formatMessage({
              id: 'referralCodeExemptsFee',
            })} (${formatNumber(onboarding_fee, {
              style: 'currency',
              currency: 'xaf',
            })})`}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          justifySelf: 'end',
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 4,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          color="inherit"
          onClick={onPrev}
        >
          {formatMessage({ id: 'back' })}
        </Button>
        <Button type="submit" variant="contained" size="large" color="primary">
          {formatMessage({ id: 'next' })}
        </Button>
      </Box>
    </Box>
  );
}
