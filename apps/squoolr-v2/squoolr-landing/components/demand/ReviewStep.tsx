import { Box, Button } from '@mui/material';
import { useIntl } from 'react-intl';
import ReviewColumn from './ReviewColumn';
import { IPersonalInformation } from './forms/PersonnalInformation';
import { ISchoolInformation } from './forms/SchoolInformation';
import { IReferral } from './forms/ReferralInformation';
import { validatePhoneNumber } from '@squoolr/utils';

export default function ReviewStep({
  data,
  onboarding_fee,
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
  onPrev: () => void;
  onNext: () => void;
}) {
  const { formatMessage, formatNumber } = useIntl();

  function handlePayment() {
    if (validatePhoneNumber(data.payingNumber) !== -1) {
      //TODO: TRIGGER THE PAYMENT HERE WHEN ALL IS GOOD, THEN TRIGGER onNext
      onNext();
    } else alert(formatMessage({ id: 'enterValidPhoneForPayment' }));
  }

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
        >
          {formatMessage({ id: 'back' })}
        </Button>
        {data.referral.referral_code ? (
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onNext}
          >
            {formatMessage({
              id: 'submitDemand',
            })}
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handlePayment}
          >
            {`${formatMessage({
              id: 'payNow',
            })} (${formatNumber(onboarding_fee, {
              style: 'currency',
              currency: 'xaf',
            })})`}
          </Button>
        )}
      </Box>
    </Box>
  );
}
