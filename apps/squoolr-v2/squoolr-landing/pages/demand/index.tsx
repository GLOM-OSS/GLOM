import { SubmitSchoolDemandPayload } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import { validatePhoneNumber, excludeKeys } from '@glom/utils';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import DemandContactUs from '../../components/demand/DemandContactUs';
import ReviewStep from '../../components/demand/ReviewStep';
import StepperItem from '../../components/demand/StepperItem';
import SubmittedStep from '../../components/demand/SubmittedStep';
import ReferralDescription from '../../components/demand/descriptionPane/ReferralDescription';
import ReviewDescription from '../../components/demand/descriptionPane/ReviewDescription';
import ReviewDescriptionHeader from '../../components/demand/descriptionPane/ReviewDescriptionHeader';
import StepDescriptionCard from '../../components/demand/descriptionPane/StepDescriptionCard';
import SubmittedDescription from '../../components/demand/descriptionPane/SubmittedDescription';
import PersonnalInformation, {
  IPersonalInformation,
} from '../../components/demand/forms/PersonnalInformation';
import ReferralInformation, {
  IReferral,
} from '../../components/demand/forms/ReferralInformation';
import SchoolInformation, {
  ISchoolInformation,
} from '../../components/demand/forms/SchoolInformation';
import {
  usePlatformSettings,
  useSubmitDemand,
} from '@glom/data-access/squoolr';

interface IStep {
  title: string | JSX.Element;
  description: string | JSX.Element;
  form?: JSX.Element;
}

export default function Demand() {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [payingPhone, setPayingPhone] = useState<string>('');

  const steps: string[] = ['yourInfo', 'schoolInfo', 'ambassador', 'review'];
  const { data: platformSettings } = usePlatformSettings();
  const [demandCode, setDemandCode] = useState<string>('');

  const [personnalData, setPersonnalData] = useState<IPersonalInformation>({
    confirm_password: '',
    email: '',
    first_name: '',
    gender: 'Male',
    last_name: '',
    password: '',
    phone_number: '',
    birthdate: new Date().toString(),
  });

  const [institutionData, setInstitutionData] = useState<ISchoolInformation>({
    initial_year_ends_at: new Date().toISOString(),
    initial_year_starts_at: new Date().toISOString(),
    school_email: '',
    school_phone_number: '',
    school_acronym: '',
    school_name: '',
  });

  const [referralData, setReferralData] = useState<IReferral>({
    lead_funnel: '',
    referral_code: '',
  });

  function handleNext() {
    if (activeStep === currentStep) setCurrentStep((prev) => prev + 1);
    setActiveStep((prev) => prev + 1);
  }

  function handleBack() {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  }

  const { mutate: submitDemand, isPending: isSubmitting } = useSubmitDemand();

  function handleSubmitDemand() {
    const submitData: SubmitSchoolDemandPayload = {
      configurator: { ...excludeKeys(personnalData, ['confirm_password']) },
      school: { ...institutionData, ...referralData },
      payment_phone: payingPhone,
    };
    if (referralData.referral_code || validatePhoneNumber(payingPhone) !== -1) {
      submitDemand(submitData, {
        onSuccess(data) {
          setDemandCode(data.school_code);
          handleNext();
        },
      });
    }
    //TODO change to toast
    else alert(formatMessage({ id: 'enterValidPhoneForPayment' }));
  }

  const stepp: Record<string, IStep> = {
    0: {
      description: formatMessage({ id: 'yourInformationDescription' }),
      title: formatMessage({ id: 'yourInformation' }),
      form: (
        <PersonnalInformation
          data={personnalData}
          onNext={(submitData: IPersonalInformation) => {
            setPersonnalData(submitData);
            setPayingPhone(submitData.phone_number);
            handleNext();
          }}
        />
      ),
    },
    1: {
      description: formatMessage({ id: 'institutionDataDescription' }),
      title: formatMessage({ id: 'institutionData' }),
      form: (
        <SchoolInformation
          data={institutionData}
          onPrev={handleBack}
          onNext={(submitData: ISchoolInformation) => {
            setInstitutionData(submitData);
            handleNext();
          }}
        />
      ),
    },
    2: {
      description: (
        <ReferralDescription
          onboarding_fee={platformSettings?.onboarding_fee ?? 0}
        />
      ),
      title: formatMessage({ id: 'ambassador' }),
      form: (
        <ReferralInformation
          onboarding_fee={platformSettings?.onboarding_fee ?? 0}
          data={referralData}
          onPrev={handleBack}
          onNext={(submitData: IReferral) => {
            setReferralData(submitData);
            handleNext();
          }}
        />
      ),
    },
    3: {
      description: (
        <ReviewDescription
          isSubmitting={isSubmitting || !!demandCode}
          payingPhone={payingPhone}
          setPayingPhone={setPayingPhone}
          referral_code={referralData.referral_code}
        />
      ),
      title: (
        <ReviewDescriptionHeader
          referral_code={referralData.referral_code}
          onboarding_fee={platformSettings?.onboarding_fee ?? 0}
        />
      ),
      form: (
        <ReviewStep
          data={{
            configuator: { ...personnalData, password: '********' },
            school: institutionData,
            referral: referralData,
            payingNumber: payingPhone,
          }}
          isSubmitting={isSubmitting || !!demandCode}
          onboarding_fee={platformSettings?.onboarding_fee ?? 0}
          onPrev={handleBack}
          onNext={handleSubmitDemand}
        />
      ),
    },
    4: {
      description: <SubmittedDescription />,
      title: formatMessage({ id: 'demandSubmitted' }),
      form: <SubmittedStep demandCode={demandCode} />,
    },
  };

  return (
    <>
      <DemandContactUs />

      <Box
        sx={{
          marginTop: '150px',
          display: { mobile: 'none', laptop: 'grid' },
          rowGap: '30px',
          alignContent: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: '32px',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'bottom',
            justifyItems: 'end',
          }}
        >
          <Box>
            <Typography variant="h3">
              {formatMessage({ id: 'demandForSchoolCreation' })}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>
              {formatMessage({ id: 'demandForSchoolCreationSubtitle' })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              alignItems: 'center',
              columnGap: 1,
            }}
          >
            {steps.map((step, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <Divider
                    sx={{
                      backgroundColor:
                        activeStep + 1 > index
                          ? theme.palette.primary.main
                          : theme.common.line,
                      height: '2px',
                      width: '100px',
                    }}
                  />
                )}
                <StepperItem
                  step={formatMessage({ id: step })}
                  activeStep={activeStep}
                  currentStep={currentStep}
                  position={index}
                  openStep={() =>
                    currentStep >= index && !isSubmitting && !demandCode
                      ? setActiveStep(index)
                      : null
                  }
                />
              </Fragment>
            ))}
          </Box>
        </Paper>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '37fr 63fr',
            columnGap: '30px',
            padding: '0 18px',
          }}
        >
          <StepDescriptionCard
            title={stepp[activeStep].title}
            description={stepp[activeStep].description}
          />
          {stepp[activeStep].form}
        </Box>
      </Box>
    </>
  );
}
