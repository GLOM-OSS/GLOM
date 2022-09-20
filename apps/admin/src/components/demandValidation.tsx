import { ReportRounded } from '@mui/icons-material';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import ValidateDemandDialog from './demand/validateDialog';
// import { DemandInterface } from './demands';

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
}

export interface DemandDetailsInterface {
  school: School;
  person: Person;
}

export default function DemandValidation() {
  const [isDemandLoading, setIsDemandLoading] = useState<boolean>(false);
  const [demand, setDemand] = useState<DemandDetailsInterface>({
    school: {
      school_name: 'IAI - Yaounde, Cameroun',
      email: 'info@iai-yde.com',
      phone: '00237657140183',
      code: '445937',
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
  });

  const { formatMessage } = useIntl();
  const { person, school } = demand;

  const [notifications, setNotifications] = useState<useNotification[]>();
  const getDemandDetails = () => {
    setIsDemandLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    setTimeout(() => {
      //TODO: call api here to get demand details with id params.demand_code
      if (random() > 5) {
        const demandDetails: DemandDetailsInterface = {
          school: {
            school_name: 'IAI - Yaounde, Cameroun',
            email: 'info@iai-yde.com',
            phone: '00237657140183',
            code: '445937',
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
  const validateDemand = (subdomain: string) => {
    setIsValidating(true);
    if (validateNotifications)
      validateNotifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (validateNotifications)
      setValidateNotifications([...validateNotifications, notif]);
    else setValidateNotifications([notif]);
    notif.notify({
      render: formatMessage({ id: 'validating' }),
    });
    //TODO: CALL VALIDATE DEMAND API HERE
    setTimeout(() => {
      console.log(subdomain);
      setIsValidating(false);
      if (random() > 5) {
        notif.update({
          render: formatMessage({ id: 'validatedDemand' }),
        });
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => validateDemand(subdomain)}
              notification={notif}
              //TODO: MESSAGE SHOULD COME FROM BACKEND
              message={formatMessage({ id: 'failedToValidate' })}
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
      <ValidateDemandDialog
        closeDialog={() => setIsValidateDemandDialogOpen(false)}
        handleSubmit={(subdomain: string) => validateDemand(subdomain)}
        isDialogOpen={isValidateDemandDialogOpen}
      />
      <Box sx={{ height: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 400 }}>
          {isDemandLoading ? (
            <Skeleton animation='wave' width={`${random() * 10 ?? 30}%`} />
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
                    <Skeleton animation='wave' width={`${random() * 10 ?? 30}%`} />
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
                    sx={{ color: theme.common.placeholder }}
                  >
                    {formatMessage({ id: key })}
                    {' :'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.common.body }}>
                    {isDemandLoading ? (
                      <Skeleton animation='wave' width={`${random() * 10 ?? 30}%`} />
                    ) : (
                      school[key as keyof School]
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
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
                disabled={isSubmitting || isDemandLoading}
              >
                {formatMessage({ id: 'reject' })}
              </Button>
              <Button
                color="primary"
                sx={{ textTransform: 'none' }}
                variant="contained"
                onClick={() => setIsValidateDemandDialogOpen(true)}
                disabled={isSubmitting || isDemandLoading}
              >
                {formatMessage({ id: 'validate' })}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
