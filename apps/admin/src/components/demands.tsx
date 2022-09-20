import { ReportRounded } from '@mui/icons-material';
import { Box, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Demand from './demand';
import DemandSkeleton from './demandSkeleton';

export interface DemandInterface {
  code: string;
  school_name: string;
  email: string;
  phone: string;
  status: 'progress' | 'pending' | 'validated' | 'rejected';
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
    setTimeout(() => {
      //TODO: CALL API HERE TO GET DEMANDS
      if (random() > 5) {
        const newDemands: DemandInterface[] = [
          {
            code: '45367',
            email: 'lorraintchakoumi@gmail.com',
            phone: '237657140183',
            school_name: 'IAI-Cameroun',
            status: 'pending',
          },
          {
            code: '45377',
            email: 'lorraintchakoumi@gmail.com',
            phone: '237657140183',
            school_name: 'IAI-Yaounde',
            status: 'progress',
          },
          {
            code: '45363',
            email: 'lorraintchakoumi@gmail.com',
            phone: '237657140183',
            school_name: 'IAI-Douala',
            status: 'rejected',
          },
          {
            code: '455467',
            email: 'lorraintchakoumi@gmail.com',
            phone: '237657140183',
            school_name: 'IAI-Bangangte',
            status: 'validated',
          },
        ];
        setDemands(newDemands);
        setAreDemandsLoading(false);
        notif.dismiss();
        setNotifications([]);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingDemands' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getDemands}
              notification={notif}
              message={formatMessage({ id: 'getDemandsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
