import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  editDemandStatus,
  getDemandInfo,
  validateDemand as validateSchoolDemand,
} from '@squoolr/api-services';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import ConfirmProgressDialog from './ConfirmProgressDialog';
import { Status } from './demands';
import RejectDemandDialog from './rejectDailog';
import ValidateDemandDialog from './validateDialog';

interface Person {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  birthdate: string;
  gender: 'Male' | 'Female';
  national_id_number: string;
}

interface School {
  school_name: string;
  email: string;
  phone_number: string;
  code: string;
  school_status: 'validated' | 'progress' | 'rejected' | 'pending';
}

export interface DemandDetailsInterface {
  school: School;
  person: Person;
}

export default function DemandValidation() {
  const [isDemandLoading, setIsDemandLoading] = useState<boolean>(false);
  const [demand, setDemand] = useState<DemandDetailsInterface>({
    school: {
      school_name: '',
      email: '',
      phone_number: '',
      code: '',
      school_status: 'pending',
    },
    person: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      birthdate: '',
      gender: 'Male',
      national_id_number: '',
    },
  });

  const { formatMessage } = useIntl();
  const { person, school } = demand;

  const [notifications, setNotifications] = useState<useNotification[]>();
  const { demand_code } = useParams();
  const navigate = useNavigate();
  const getDemandDetails = () => {
    setIsDemandLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    getDemandInfo(demand_code as string)
      .then((demandDetails) => {
        if (!demandDetails) return navigate('/management/demands');
        const {
          person: { birthdate, phone_number, ...person },
          school: {
            demand_status,
            school_name,
            school_email: email,
            school_phone_number,
          },
        } = demandDetails;
        setDemand({
          person: {
            birthdate: new Date(birthdate).toISOString(),
            phone_number: phone_number,
            ...person,
          },
          school: {
            email,
            school_name,
            code: demand_code as string,
            phone_number: school_phone_number,
            school_status: demand_status as Status,
          },
        });
        setIsDemandLoading(false);
        notif.dismiss();
        setNotifications([]);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingDemandDetails' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getDemandDetails}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getDemandDetailsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };
  useEffect(() => {
    getDemandDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isValidateDemandDialogOpen, setIsValidateDemandDialogOpen] =
    useState<boolean>(false);

  const [validateNotifications, setValidateNotifications] =
    useState<useNotification[]>();
  const [isSubmitting, setIsValidating] = useState<boolean>(false);
  const validateDemand = (response: string, usage: 'reject' | 'validate') => {
    setIsValidating(true);
    if (validateNotifications)
      validateNotifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (validateNotifications)
      setValidateNotifications([...validateNotifications, notif]);
    else setValidateNotifications([notif]);
    notif.notify({
      render: formatMessage({
        id: usage === 'validate' ? 'validating' : 'rejecting',
      }),
    });
    setIsValidating(false);
    validateSchoolDemand(
      demand_code as string,
      usage === 'validate'
        ? { subdomain: response }
        : { rejection_reason: response }
    )
      .then(() => {
        notif.update({
          render:
            usage === 'validate'
              ? formatMessage({ id: 'validatedDemand' })
              : formatMessage({ id: 'rejectedDemand' }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => validateDemand(response, usage)}
              notification={notif}
              message={
                error?.message ||
                (usage === 'validate'
                  ? formatMessage({ id: 'failedToValidate' })
                  : formatMessage({ id: 'failedToReject' }))
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsValidating(false));
  };

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isConfirmProgressDialogOpen, setIsConfirmProgressDialogOpen] =
    useState<boolean>(false);

  const changeDemandStatus = () => {
    setIsValidating(true);
    setIsConfirmProgressDialogOpen(false);
    if (validateNotifications)
      validateNotifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (validateNotifications)
      setValidateNotifications([...validateNotifications, notif]);
    else setValidateNotifications([notif]);
    notif.notify({
      render: formatMessage({
        id: 'settingState',
      }),
    });
    editDemandStatus(demand_code as string)
      .then(() => {
        notif.update({
          render: formatMessage({ id: 'demandStatusChanged' }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={changeDemandStatus}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'failedToChangeDemandStatus' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsValidating(false));
  };
  const schoolDemandStatus = demand.school.school_status.toLocaleLowerCase();

  return (
    <>
      <ConfirmProgressDialog
        isDialogOpen={isConfirmProgressDialogOpen}
        handleConfirm={changeDemandStatus}
        closeDialog={() => setIsConfirmProgressDialogOpen(false)}
      />
      <ValidateDemandDialog
        closeDialog={() => setIsValidateDemandDialogOpen(false)}
        handleSubmit={(response: string) =>
          validateDemand(response, 'validate')
        }
        isDialogOpen={isValidateDemandDialogOpen}
      />
      <RejectDemandDialog
        closeDialog={() => setIsRejectDialogOpen(false)}
        handleSubmit={(response: string) => validateDemand(response, 'reject')}
        isDialogOpen={isRejectDialogOpen}
      />
      <Box sx={{ height: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 400 }}>
          {isDemandLoading ? (
            <Skeleton animation="wave" width={`${random() * 10 ?? 30}%`} />
          ) : (
            `${demand.school.code} - ${demand.school.school_name}`
          )}
        </Typography>
        <Box
          sx={{
            marginTop: theme.spacing(6.25),
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: theme.spacing(4),
          }}
        >
          <Box>
            {Object.keys(person).map((key, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: theme.spacing(1),
                  padding: `${theme.spacing(1)} 0`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.common.placeholder }}
                >
                  {formatMessage({ id: key })}
                  {' :'}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.common.body }}>
                  {isDemandLoading ? (
                    <Skeleton
                      animation="wave"
                      width={`${random() * 10 ?? 30}%`}
                    />
                  ) : (
                    person[key as keyof Person]
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
            <Box>
              {Object.keys(school).map((key, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: theme.spacing(1),
                    padding: `${theme.spacing(1)} 0`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.common.placeholder,
                      alignSelf: 'center',
                    }}
                  >
                    {formatMessage({ id: key })}
                    {' :'}
                  </Typography>
                  {'school_status' === key ? (
                    isDemandLoading ? (
                      <Skeleton
                        animation="wave"
                        width={`${random() * 10 ?? 30}%`}
                      />
                    ) : (
                      <Chip
                        sx={{
                          justifySelf: 'start',
                          alignSelf: 'center',
                          backgroundColor: lighten(
                            theme.palette[
                              schoolDemandStatus === 'pending'
                                ? 'info'
                                : schoolDemandStatus === 'progress'
                                ? 'secondary'
                                : schoolDemandStatus === 'validated'
                                ? 'success'
                                : 'error'
                            ].main,
                            0.6
                          ),
                        }}
                        label={formatMessage({
                          id: schoolDemandStatus,
                        })}
                      />
                    )
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: theme.common.body }}
                    >
                      {isDemandLoading ? (
                        <Skeleton
                          animation="wave"
                          width={`${random() * 10 ?? 30}%`}
                        />
                      ) : (
                        school[key as keyof School]
                      )}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            {schoolDemandStatus === 'pending' ? (
              <Button
                color="primary"
                sx={{ textTransform: 'none', justifySelf: 'end' }}
                variant="contained"
                disabled={
                  isSubmitting ||
                  isDemandLoading ||
                  isRejectDialogOpen ||
                  isValidateDemandDialogOpen ||
                  isConfirmProgressDialogOpen
                }
                onClick={() => {
                  if (validateNotifications)
                    validateNotifications.forEach((notification) =>
                      notification.dismiss()
                    );
                  setIsConfirmProgressDialogOpen(true);
                }}
              >
                {formatMessage({ id: 'changeStatus' })}
              </Button>
            ) : schoolDemandStatus === 'progress' ? (
              <Box
                sx={{
                  justifySelf: 'start',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: theme.spacing(2),
                }}
              >
                <Button
                  color="error"
                  sx={{ textTransform: 'none' }}
                  variant="contained"
                  disabled={
                    isSubmitting ||
                    isDemandLoading ||
                    isRejectDialogOpen ||
                    isValidateDemandDialogOpen ||
                    isConfirmProgressDialogOpen
                  }
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  {formatMessage({ id: 'reject' })}
                </Button>
                <Button
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  variant="contained"
                  onClick={() => setIsValidateDemandDialogOpen(true)}
                  disabled={
                    isSubmitting ||
                    isDemandLoading ||
                    isRejectDialogOpen ||
                    isValidateDemandDialogOpen ||
                    isConfirmProgressDialogOpen
                  }
                >
                  {formatMessage({ id: 'validate' })}
                </Button>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
