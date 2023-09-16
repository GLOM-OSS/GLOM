import { ReportRounded } from '@mui/icons-material';
import { Box, lighten, Typography } from '@mui/material';
import { getDemands as fetchDemands } from '@squoolr/api-services';
import { theme } from '@glom/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Demand from './demand';
import DemandSkeleton from './demandSkeleton';

export type Status = 'progress' | 'pending' | 'validated' | 'rejected';
export interface DemandInterface {
  code: string;
  school_name: string;
  email: string;
  phone_number: string;
  status: Status;
}

export default function Demands() {
  const intl = useIntl();
  const { formatMessage } = intl;

  const [demands, setDemands] = useState<DemandInterface[]>([]);
  const [areDemandsLoading, setAreDemandsLoading] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<useNotification[]>();
  const getDemands = () => {
    setAreDemandsLoading(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);
    fetchDemands()
      .then((demands) => {
        setDemands(
          demands.map(
            ({
              school_name,
              school_email,
              demand_status,
              school_code: code,
              school_phone_number: phone_number,
            }) => ({
              code,
              email: school_email,
              phone_number,
              school_name,
              status: demand_status as Status,
            })
          )
        );
        setAreDemandsLoading(false);
        notif.dismiss();
        setNotifications([]);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingDemands' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getDemands}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getDemandsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    getDemands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
          display: 'grid',
          columnGap: theme.spacing(10),
          gridTemplateColumns: '100px 1fr 1fr 1fr 8ch',
          borderRadius: theme.spacing(1),
          backgroundColor: lighten(theme.palette.primary.light, 0.6),
          alignItems: 'center',
        }}
      >
        <Typography sx={{ width: '17ch' }}>
          {formatMessage({ id: 'code' })}
        </Typography>
        <Typography>{formatMessage({ id: 'schoolName' })}</Typography>
        <Typography>{formatMessage({ id: 'email' })}</Typography>
        <Typography>{formatMessage({ id: 'phone' })}</Typography>
        <Typography>{formatMessage({ id: 'status' })}</Typography>
      </Box>
      <Box>
        {areDemandsLoading &&
          [...new Array(5)].map((_, index) => <DemandSkeleton key={index} />)}
        {!areDemandsLoading && demands.length === 0 && (
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', marginTop: theme.spacing(3.125) }}
          >
            {formatMessage({ id: 'noDemands' })}
          </Typography>
        )}
        {!areDemandsLoading &&
          demands.length > 0 &&
          demands.map((demand, index) => (
            <Demand demand={demand} key={index} />
          ))}
      </Box>
    </Box>
  );
}
