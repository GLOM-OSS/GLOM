import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import ConfirmProgressDialog from './ConfirmProgressDialog';
import RejectDemandDialog from './rejectDailog';
import ValidateDemandDialog from './validateDialog';

interface Person {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  national_id_number: string;
}

interface School {
  school_name: string;
  email: string;
  phone: string;
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
      phone: '',
      code: '',
      school_status: 'pending',
    },
    person: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'Male',
      national_id_number: '',
    },
  });

  const { formatMessage } = useIntl();
  const { person, school } = demand;

  const [notifications, setNotifications] = useState<useNotification[]>();
  const { demand_code } = useParams();
  const getDemandDetails = () => {
    setIsDemandLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    setTimeout(() => {
      //TODO: call api here to get demand details with code demand_code
      if (random() > 5) {
        const demandDetails: DemandDetailsInterface = {
          school: {
            school_name: 'IAI - Yaounde, Cameroun',
            email: 'info@iai-yde.com',
            phone: '00237657140183',
            code: '445937',
            school_status: 'validated',
          },
          person: {
            first_name: 'Kouatchoua Tchakoumi',
            last_name: 'Lorrain',
            email: 'ltchakoumi@outlook.com',
            phone: '00237693256789',
            date_of_birth: '27/03/1999',
            gender: 'Male',
            national_id_number: '000316122',
          },
        };
        setDemand(demandDetails);
        setIsDemandLoading(false);
        notif.dismiss();
        setNotifications([]);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingDemandDetails' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getDemandDetails}
              notification={notif}
              message={formatMessage({ id: 'getDemandDetailsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
    setTimeout(() => {
      console.log(response);
      setIsValidating(false);
      if (usage === 'validate') {
        //TODO: CALL VALIDATE DEMAND API HERE WITH DATA reponse
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'validatedDemand' }),
          });
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => validateDemand(response, usage)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToValidate' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      } else {
        //TODO CALL API TO REJECT DEMAND HERE WITH DATA response
        if (random() > 5) {
          notif.update({
            render: formatMessage({ id: 'rejectedDemand' }),
          });
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => validateDemand(response, usage)}
                notification={notif}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToReject' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }
    }, 3000);
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
    setTimeout(() => {
      setIsValidating(false);
      //TODO: CALL API HERE TO CHANGE DEMAND STATUS TO PROGRESS WITH DATA demand_code
      if (random() > 5) {
        notif.update({
          render: formatMessage({ id: 'demandStatusChanged' }),
        });
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={changeDemandStatus}
              notification={notif}
              //TODO: MESSAGE SHOULD COME FROM BACKEND
              message={formatMessage({ id: 'failedToChangeDemandStatus' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

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
                              demand.school.school_status === 'pending'
                                ? 'info'
                                : demand.school.school_status === 'progress'
                                ? 'secondary'
                                : demand.school.school_status === 'validated'
                                ? 'success'
                                : 'error'
                            ].main,
                            0.6
                          ),
                        }}
                        label={formatMessage({
                          id: demand.school.school_status,
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
            {demand.school.school_status === 'pending' ? (
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
            ) : demand.school.school_status === 'progress' ? (
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
