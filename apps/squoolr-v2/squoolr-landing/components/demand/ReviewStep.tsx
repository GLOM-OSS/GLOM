import { Box, Button, CircularProgress } from '@mui/material';
import { useIntl } from 'react-intl';
import ReviewColumn from './ReviewColumn';
import { IPersonalInformation } from './forms/PersonnalInformation';
import { IReferral } from './forms/ReferralInformation';
import { ISchoolInformation } from './forms/SchoolInformation';

export default function ReviewStep({
  data,
  onboarding_fee,
  isSubmitting,
  onPrev,
  onNext,
}: {
  data: {
    configuator: IPersonalInformation;
    school: ISchoolInformation;
    referral: IReferral;
    payingNumber: string;
  };
  onboarding_fee: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { formatMessage, formatNumber } = useIntl();

  return (
    <Box sx={{ display: 'grid', rowGap: 4, alignContent: 'start' }}>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
        }}
      >
        <ReviewColumn
          data={data['configuator']}
          order={[
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'birthdate',
            'gender',
            'password',
          ]}
          title={formatMessage({ id: 'yourInformation' })}
        />
        <ReviewColumn
          data={data['school']}
          order={[
            'school_name',
            'school_acronym',
            'school_email',
            'school_phone_number',
            'initial_year_starts_at',
            'initial_year_ends_at',
          ]}
          title={formatMessage({ id: 'institutionData' })}
        />
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
          disabled={isSubmitting}
        >
          {formatMessage({ id: 'back' })}
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onNext}
          disabled={isSubmitting}
          startIcon={
            isSubmitting && <CircularProgress color="primary" size={18} />
          }
        >
          {data.referral.referral_code
            ? formatMessage({
                id: 'submitDemand',
              })
            : `${formatMessage({
                id: 'payNow',
              })} (${formatNumber(onboarding_fee, {
                style: 'currency',
                currency: 'xaf',
              })})`}
        </Button>
      </Box>
    </Box>
  );
}
