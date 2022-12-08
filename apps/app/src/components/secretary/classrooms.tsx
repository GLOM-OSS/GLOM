import { ReportRounded } from '@mui/icons-material';
import { Box, lighten, Skeleton, Typography } from '@mui/material';
import { getClassrooms } from '@squoolr/api-services';
import { theme, useLanguage } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { FormattedNumberParts, useIntl } from 'react-intl';
import { useParams } from 'react-router';

export interface ClassroomInterface {
  classroom_code: string;
  classroom_acronym: string;
  classroom_name: string;
  classroom_level: number;
  registration_fee: number;
  total_fee_due: number;
}

const Classroom = ({
  classroom: {
    classroom_code,
    classroom_level,
    classroom_name,
    registration_fee,
    total_fee_due,
  },
  index,
}: {
  classroom: ClassroomInterface;
  index: number;
}) => {
  const { activeLanguage } = useLanguage();
  return (
    <Box
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
        display: 'grid',
        columnGap: theme.spacing(10),
        gridTemplateColumns: '155px 1fr .5fr .5fr',
        borderRadius: theme.spacing(1),
        backgroundColor: lighten(
          theme.palette.primary.light,
          index % 2 === 0 ? 1 : 0.9
        ),
      }}
    >
      <Typography sx={{ width: '17ch' }}>{classroom_code}</Typography>
      <Typography>{classroom_name}</Typography>
      <Typography>
        <FormattedNumberParts
          value={registration_fee}
          style="currency"
          currency="XAF"
          currencyDisplay="symbol"
        >
          {(parts) => {
            return activeLanguage === 'Fr' ? (
              <>
                {parts.map((part, index) => {
                  return index !== parts.length - 1 ? part.value : null;
                })}
                <small>{` ${parts[parts.length - 1].value}`}</small>
              </>
            ) : (
              <>
                {parts.map((part, index) => {
                  return index !== 0 ? part.value : null;
                })}
                <small>{` ${parts[0].value}`}</small>
              </>
            );
          }}
        </FormattedNumberParts>
      </Typography>
      <Typography>
        <FormattedNumberParts
          value={total_fee_due}
          style="currency"
          currency="XAF"
          currencyDisplay="symbol"
        >
          {(parts) => {
            return activeLanguage === 'Fr' ? (
              <>
                {parts.map((part, index) => {
                  return index !== parts.length - 1 ? part.value : null;
                })}
                <small>{` ${parts[parts.length - 1].value}`}</small>
              </>
            ) : (
              <>
                {parts.map((part, index) => {
                  return index !== 0 ? part.value : null;
                })}
                <small>{` ${parts[0].value}`}</small>
              </>
            );
          }}
        </FormattedNumberParts>
      </Typography>
    </Box>
  );
};

const ClassroomSkeleton = ({ index }: { index: number }) => {
  return (
    <Box
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
        display: 'grid',
        columnGap: theme.spacing(10),
        gridTemplateColumns: '155px 1fr .5fr .5fr',
        borderRadius: theme.spacing(1),
        backgroundColor: lighten(
          theme.palette.primary.light,
          index % 2 === 0 ? 1 : 0.9
        ),
      }}
    >
      <Typography sx={{ width: '17ch' }}>
        <Skeleton animation="wave" width={`${random() * 10}%`} />{' '}
      </Typography>
      <Typography>
        <Skeleton animation="wave" width={`${random() * 10}%`} />
      </Typography>
      <Typography>
        <Skeleton animation="wave" width={`${random() * 10}%`} />
      </Typography>
      <Typography>
        <Skeleton animation="wave" width={`${random() * 10}%`} />
      </Typography>
    </Box>
  );
};

export default function Classrooms() {
  const { formatMessage } = useIntl();
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);

  const [notification, setNotification] = useState<useNotification>();
  const [areClassroomsLoading, setAreClassroomsLoading] =
    useState<boolean>(false);
  const { major_code } = useParams();

  const loadClassrooms = () => {
    setAreClassroomsLoading(true);
    if (notification) notification.dismiss();
    const notif = new useNotification();
    setNotification(notif);
    getClassrooms({ major_code })
      .then((classrooms) => {
        setClassrooms(classrooms);
        setAreClassroomsLoading(false);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingClassrooms' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadClassrooms}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'loadingClassroomsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: '100%',
        rowGap: theme.spacing(2),
      }}
    >
      <Typography variant="h5">
        {formatMessage({ id: 'classrooms' })}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          height: '100%',
          rowGap: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
            display: 'grid',
            columnGap: theme.spacing(10),
            gridTemplateColumns: '155px 1fr .5fr .5fr',
            borderRadius: theme.spacing(1),
            backgroundColor: lighten(theme.palette.primary.light, 0.6),
          }}
        >
          <Typography sx={{ width: '17ch' }}>
            {formatMessage({ id: 'code' })}
          </Typography>
          <Typography>{formatMessage({ id: 'classroom_name' })}</Typography>
          <Typography>{formatMessage({ id: 'registration_fee' })}</Typography>
          <Typography>{formatMessage({ id: 'total_fee_due' })}</Typography>
        </Box>
        <Scrollbars height={'100%'}>
          {areClassroomsLoading &&
            [...new Array(7)].map((_, index) => (
              <ClassroomSkeleton index={index} key={index} />
            ))}
          {!areClassroomsLoading && classrooms.length === 0 && (
            <Box
              sx={{
                display: 'grid',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Typography variant="body2">
                {formatMessage({ id: 'noClassrooms' })}
              </Typography>
            </Box>
          )}
          {!areClassroomsLoading &&
            classrooms.length > 0 &&
            classrooms.map((classroom, index) => (
              <Classroom classroom={classroom} key={index} index={index} />
            ))}
        </Scrollbars>
      </Box>
    </Box>
  );
}
