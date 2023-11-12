import { ConfirmDialog } from '@glom/components';
import {
  useSchoolDemandDetails,
  useUpdateDemandStaus,
  useValidateDemand,
} from '@glom/data-access/squoolr';
import { useTheme } from '@glom/theme';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import RejectDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/RejectDemandDialog';
import ReviewColumn from 'apps/squoolr-v2/admin/component/management/demands/ReviewColumn';
import ValidateDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/ValidateDemandDialog';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { STATUS_CHIP_COLOR, STATUS_CHIP_VARIANT } from '..';

export default function index() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const {
    query: { school_id },
    asPath,
  } = useRouter();
  const schoolId = school_id as string;
  const { data: schoolData, refetch: refetchSchoolDemandDetails } =
    useSchoolDemandDetails(schoolId);

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(false);
  const [isConfirmSuspendDialogOpen, setIsConfirmSuspendDialogOpen] =
    useState<boolean>(false);

  const { mutate: updateDemandStatus, isPending: isConfirmingSuspension } =
    useUpdateDemandStaus(schoolId);
  function suspendSchool() {
    updateDemandStatus('SUSPENDED', {
      onSuccess() {
        refetchSchoolDemandDetails();
        //TODO: TOAST SUSPENDING AND DONE SUSPENDING
      },
    });
  }
  const { mutate: validateDemand, isPending: isValidatingDemand } =
    useValidateDemand(schoolId);

  function rejectSchool(rejectionReason: string) {
    validateDemand(
      { rejection_reason: rejectionReason },
      {
        onSuccess() {
          //TODO: TOAST REJECTING AND DONE REJECTING
          refetchSchoolDemandDetails();
        },
      }
    );
  }

  function validateSchool(subdomain: string) {
    validateDemand(
      { subdomain },
      {
        onSuccess() {
          //TODO: TOAST validating and done validating
          refetchSchoolDemandDetails();
        },
      }
    );
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
                    disabled={isValidatingDemand || isValidatingDemand}
                    startIcon={
                      isValidatingDemand && (
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
                    disabled={isValidatingDemand || isValidatingDemand}
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
                  sx={{ alignSelf: 'end' }}
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
        </Box>
      </Box>
    </>
  );
};
