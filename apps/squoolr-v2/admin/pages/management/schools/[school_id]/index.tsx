import { ConfirmDialog } from '@glom/components';
import {
  useSchoolDemandDetails,
  useUpdateSchoolStatus,
  useValidateSchoolDemand,
} from '@glom/data-access/squoolr';
import { useTheme } from '@glom/theme';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import RejectDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/RejectDemandDialog';
import ReviewColumn from 'apps/squoolr-v2/admin/component/management/demands/ReviewColumn';
import ValidateDemandDialog from 'apps/squoolr-v2/admin/component/management/demands/ValidateDemandDialog';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { STATUS_CHIP_COLOR, STATUS_CHIP_VARIANT } from '..';

export default function index() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const {
    query: { school_id },
  } = useRouter();
  const schoolId = school_id as string;
  const {
    data: schoolData,
    refetch: refetchSchoolData,
    isFetching: isFetchingschoolData,
  } = useSchoolDemandDetails(schoolId);

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] =
    useState<boolean>(false);
  const [isConfirmSuspendDialogOpen, setIsConfirmSuspendDialogOpen] =
    useState<boolean>(false);

  const { mutate: updateDemandStatus, isPending: isConfirmingSuspension } =
    useUpdateSchoolStatus(schoolId);
  function suspendSchool() {
    updateDemandStatus('SUSPENDED', {
      onSuccess() {
        refetchSchoolData();
      },
    });
  }
  const { mutate: validateDemand, isPending: isValidatingDemand } =
    useValidateSchoolDemand(schoolId);

  function rejectSchool(rejectionReason: string) {
    validateDemand(
      { rejection_reason: rejectionReason },
      {
        onSuccess() {
          refetchSchoolData();
        },
      }
    );
  }

  function validateSchool(subdomain: string) {
    validateDemand(
      { subdomain },
      {
        onSuccess() {
          refetchSchoolData();
        },
      }
    );
  }

  useEffect(() => {
    if (schoolData) {
      const {
        school: { school_demand_status },
      } = schoolData;
      setTimeout(() => {
        if (school_demand_status === 'PENDING')
          updateDemandStatus('PROCESSING', {
            onSuccess() {
              refetchSchoolData();
            },
          });
      }, 2 * 60 * 1000);
    }
  }, [schoolData]);

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
          schoolData?.school.school_acronym
        }`}
        danger
      />
      {
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
            {isFetchingschoolData || !schoolData ? (
              <Skeleton />
            ) : (
              <>
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
                  color={
                    STATUS_CHIP_COLOR[schoolData.school.school_demand_status]
                  }
                  label={formatMessage({
                    id: schoolData.school.school_demand_status.toLowerCase(),
                  })}
                  sx={{
                    ...(schoolData.school.school_demand_status === 'VALIDATED'
                      ? { color: 'white' }
                      : {}),
                  }}
                />
              </>
            )}
          </Box>
          <Box sx={{ display: 'grid', rowGap: 4, alignContent: 'start' }}>
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                columnGap: 2,
              }}
            >
              <ReviewColumn
                data={
                  isFetchingschoolData || !schoolData
                    ? {
                        school_name: <Skeleton width={100} />,
                        school_acronym: <Skeleton width={100} />,
                        school_email: <Skeleton width={100} />,
                        school_phone_number: <Skeleton width={100} />,
                        start_at: <Skeleton width={100} />,
                        end_at: <Skeleton width={100} />,
                        lead_funnel: <Skeleton width={100} />,
                        ambassador_email: <Skeleton width={100} />,
                      }
                    : {
                        ...schoolData.school,
                        ...schoolData.academicYear,
                      }
                }
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

              <Box sx={{ display: 'grid', rowGap: 2 }}>
                <ReviewColumn
                  data={
                    isFetchingschoolData || !schoolData
                      ? {
                          first_name: <Skeleton width={100} />,
                          last_name: <Skeleton width={100} />,
                          email: <Skeleton width={100} />,
                          phone_number: <Skeleton width={100} />,
                          birth: <Skeleton width={100} />,
                          gender: <Skeleton width={100} />,
                        }
                      : schoolData?.person
                  }
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
                  schoolData?.school.school_demand_status
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
                {schoolData?.school.school_demand_status === 'VALIDATED' && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ alignSelf: 'end' }}
                    onClick={() => setIsConfirmSuspendDialogOpen(true)}
                  >
                    {formatMessage({ id: 'suspend' })}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      }
    </>
  );
}
