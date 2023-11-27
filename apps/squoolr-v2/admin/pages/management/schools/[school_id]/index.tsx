import { ConfirmDialog } from '@glom/components';
import {
  useSchoolDemandDetails,
  useUpdateSchoolStatus,
  useValidateSchoolDemand,
} from '@glom/data-access/squoolr';
import {
  useBreadcrumb,
  useDispatchBreadcrumb,
} from '@glom/squoolr-v2/side-nav';
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
    asPath,
  } = useRouter();
  const schoolId = school_id as string;
  const {
    data: schoolData,
    refetch: refetchSchoolData,
    isLoading: isLoadingSchoolData,
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
        setIsConfirmSuspendDialogOpen(false);
      },
    });
  }
  const [isValidatingDemand, setIsValidatingDemand] = useState<boolean>(false);
  const [isRejectingDemand, setIsRejectingDemand] = useState<boolean>(false);
  const { mutate: validateDemand } = useValidateSchoolDemand(schoolId);

  function rejectSchool(rejectionReason: string) {
    setIsRejectingDemand(true);
    validateDemand(
      { rejection_reason: rejectionReason },
      {
        onSuccess() {
          refetchSchoolData();
          setIsRejectingDemand(false);
        },
        onError() {
          setIsRejectingDemand(false);
        },
      }
    );
  }

  function validateSchool(subdomain: string) {
    setIsValidatingDemand(true);
    validateDemand(
      { subdomain },
      {
        onSuccess() {
          refetchSchoolData();
          setIsValidatingDemand(false);
        },
        onError() {
          setIsValidatingDemand(false);
        },
      }
    );
  }

  const breadcrumbDispatch = useDispatchBreadcrumb();
  const breadcrumbs = useBreadcrumb();
  useEffect(() => {
    const tt = asPath.split('/');
    const doesBreadcrumbHaveItem = breadcrumbs.find(
      ({ route }) => route && route.includes(tt[length - 1])
    );
    if (!!schoolData) {
      const {
        school: { school_demand_status, school_code, school_acronym },
      } = schoolData;

      if (!doesBreadcrumbHaveItem)
        breadcrumbDispatch({
          action: 'ADD',
          payload: [{ title: school_acronym, route: asPath }],
        });
      else if (doesBreadcrumbHaveItem.title !== school_acronym) {
        const tt = breadcrumbs.filter(
          ({ route }) =>
            (route && !route.includes(school_code as string)) || !route
        );
        breadcrumbDispatch({
          action: 'RESET',
          payload: [...tt, { title: school_acronym, route: asPath }],
        });
      }

      setTimeout(() => {
        if (school_demand_status === 'PENDING')
          updateDemandStatus('PROCESSING', {
            onSuccess() {
              refetchSchoolData();
            },
          });
      }, 2 * 60 * 1000);
    } else {
      if (!doesBreadcrumbHaveItem)
        breadcrumbDispatch({
          action: 'ADD',
          payload: [{ title: formatMessage({ id: 'loading' }), route: asPath }],
        });
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
            {isLoadingSchoolData || !schoolData ? (
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
                  isLoadingSchoolData || !schoolData
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
                    isLoadingSchoolData || !schoolData
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
                      disabled={isValidatingDemand || isRejectingDemand}
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
                      disabled={isValidatingDemand || isRejectingDemand}
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
                    sx={{
                      alignSelf: 'end',
                      justifySelf: 'center',
                      width: '50%',
                    }}
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
