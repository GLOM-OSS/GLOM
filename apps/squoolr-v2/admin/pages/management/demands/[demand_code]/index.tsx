import { SchoolDemandDetails, SchoolEntity } from '@glom/data-types/squoolr';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import ReviewColumn from 'apps/squoolr-v2/admin/component/management/demands/ReviewColumn';
import { useIntl } from 'react-intl';
import { STATUS_CHIP_COLOR, STATUS_CHIP_VARIANT } from '..';
import { useTheme } from '@glom/theme';
import { useState } from 'react';
import { ConfirmDialog, DialogTransition } from '@glom/components';
import { useRouter } from 'next/router';
import RejectDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/RejectDemandDialog';
import ValidateDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/ValidateDemandDialog';

export default function index() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const {
    query: { demand_code },
  } = useRouter();

  //TODO: FETCH SCHOOL DATA WITH DEMAND_CODE HERE.
  let schoolData: SchoolDemandDetails = {
    person: {
      birthplace: 'Nkambe',
      civil_status: 'Single',
      created_at: new Date().toISOString(),
      email: 'lorraintchakoumi@gmail.com',
      employment_status: 'Employed',
      first_name: 'Tchakoumi Lorrain',
      handicap: '',
      home_region: '',
      image_ref: '',
      last_name: 'Kouatchoua',
      latitude: 0,
      longitude: 0,
      nationality: 'Cameroon',
      person_id: 'hktv239',
      phone_number: '237657140183',
      preferred_lang: 'en',
      religion: 'Catholic',
      address: '',
      birthdate: new Date('03/27/1999').toISOString(),
      gender: 'Male',
      national_id_number: '000316122',
    },
    school: {
      ambassador_email: 'tchapleuvidal@gmail.com',
      lead_funnel: 'Facebook',
      paid_amount: 0,
      school_acronym: 'UdM',
      school_code: 'SKD1000',
      school_demand_status: 'PENDING',
      school_email: 'info@udm-aed.org',
      school_id: 'testing-123-till-uuid-works',
      school_name: 'Université des Montagnes',
      school_phone_number: '237693256789',
      school_rejection_reason: '',
    },
    academicYear: {
      ends_at: new Date().toISOString(),
      starts_at: new Date('12-22-2023').toISOString(),
    },
  };

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(true);
  const [isConfirmSuspendDialogOpen, setIsConfirmSuspendDialogOpen] =
    useState<boolean>(false);

  //TODO: REMOVE THIS STATE AND USE reactQuery own...
  const [isConfirmingSuspension, setIsConfirmingSuspension] =
    useState<boolean>(false);
  function suspendSchool() {
    //TODO: CALL API HERE TO SUSPEND SCHOOL WITH CODE demand_code or id: schoolData.school.school_id
    //TODO: TOAST SUSPENDING AND DONE SUSPENDING
    setIsConfirmingSuspension(true);
    setTimeout(() => {
      setIsConfirmingSuspension(true);
      //TODO: CLOSE DIALOG ON CONFIRM
      setIsConfirmSuspendDialogOpen(false);
    }, 3000);
  }

  //TODO: REMOVE THIS STATE AND USE reactQuery own...
  const [isRejectingDemand, setIsRejectingDemand] = useState<boolean>(false);
  function rejectSchool(rejectionReason: string) {
    //TODO: CALL API TO REJECT SCHOOL HERE WITH rejectionReason and school_id: schoolData.school.school_id or demand_code
    //TODO: TOAST REJECTING AND DONE REJECTING
    setIsRejectingDemand(true);
    setTimeout(() => {
      //TODO: MUTUTATE schoolData AFTER REJECTION
      schoolData = {
        ...schoolData,
        school: { ...schoolData.school, school_demand_status: 'REJECTED' },
      };
      setIsRejectingDemand(false);
    }, 3000);
  }

  //TODO: REMOVE THIS STATE AND USE reactQuery own...
  const [isValidatingDemand, setIsValidatingDemand] = useState<boolean>(false);
  function validateSchool(subdomain: string) {
    //TODO: CALL API TO validate SCHOOL HERE WITH subdomain and school_id: schoolData.school.school_id or demand_code
    //TODO: TOAST validating and done validating
    setIsValidatingDemand(true);
    setTimeout(() => {
      //TODO: MUTUTATE schoolData AFTER validation
      schoolData = {
        ...schoolData,
        school: { ...schoolData.school, school_demand_status: 'VALIDATED' },
      };
      setIsValidatingDemand(false);
    }, 3000);
  }

  return (
    <>
      <ValidateDemandDialog
        closeDialog={() => setIsValidateDialogOpen(false)}
        handleSubmit={validateSchool}
        isDialogOpen={isValidateDialogOpen}
      />
      <RejectDemandDialog
        closeDialog={() => setIsRejectDialogOpen(false)}
        handleSubmit={rejectSchool}
        isDialogOpen={isRejectDialogOpen}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmSuspendDialogOpen(false)}
        dialogMessage={formatMessage({
          id: 'confirmSuspendSchoolDialogMessage',
        })}
        confirm={suspendSchool}
        isSubmitting={isConfirmingSuspension}
        isDialogOpen={isConfirmSuspendDialogOpen}
        closeOnConfirm
        confirmButton={formatMessage({ id: 'yesSuspend' })}
        dialogTitle={`${formatMessage({ id: 'suspend' })} ${
          schoolData.school.school_acronym
        }`}
        danger
      />
      <Box sx={{ display: 'grid', alignContent: 'start', rowGap: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            justifyItems: 'start',
            columnGap: 1,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: `${theme.common.body} !important`,
              paddingBottom: '0 !important',
            }}
          >{`${schoolData.school.school_acronym} - ${schoolData.school.school_name}`}</Typography>
          <Chip
            size="small"
            variant={
              STATUS_CHIP_VARIANT[schoolData.school.school_demand_status]
            }
            color={STATUS_CHIP_COLOR[schoolData.school.school_demand_status]}
            label={formatMessage({
              id: schoolData.school.school_demand_status.toLowerCase(),
            })}
            sx={{
              ...(schoolData.school.school_demand_status === 'VALIDATED'
                ? { color: 'white' }
                : {}),
            }}
          />
        </Box>
        <Box sx={{ display: 'grid', rowGap: 4, alignContent: 'start' }}>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: 2,
            }}
          >
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              <ReviewColumn
                data={schoolData['person']}
                order={[
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                  'birthdate',
                  'gender',
                ]}
                title={formatMessage({ id: 'configuratorInformation' })}
              />
              {['PENDING', 'PROCESSING'].includes(
                schoolData.school.school_demand_status
              ) && (
                <Box
                  sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    columnGap: 5,
                    alignSelf: 'end',
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isRejectingDemand || isValidatingDemand}
                    startIcon={
                      isRejectingDemand && (
                        <CircularProgress color="error" size={18} />
                      )
                    }
                  >
                    {formatMessage({ id: 'reject' })}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsValidateDialogOpen(true)}
                    disabled={isRejectingDemand || isValidatingDemand}
                    startIcon={
                      isValidatingDemand && (
                        <CircularProgress color="primary" size={18} />
                      )
                    }
                  >
                    {formatMessage({ id: 'validate' })}
                  </Button>
                </Box>
              )}
              {schoolData.school.school_demand_status === 'VALIDATED' && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIsConfirmSuspendDialogOpen(true)}
                >
                  {formatMessage({ id: 'suspend' })}
                </Button>
              )}
            </Box>
            <ReviewColumn
              data={{ ...schoolData['school'], ...schoolData['academicYear'] }}
              order={[
                'school_name',
                'school_acronym',
                'school_email',
                'school_phone_number',
                'starts_at',
                'ends_at',
                'lead_funnel',
                'ambassador_email',
              ]}
              title={formatMessage({ id: 'institutionData' })}
            />
          </Box>
          {/* <Box
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
        </Box> */}
        </Box>
      </Box>
    </>
  );
}
9;
