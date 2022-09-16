import { ReportRounded } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { AcademicYearInterface, SelectAcademicYearDialog } from '@squoolr/auth';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export default function SwapAcademicYear({
  activeYear: { starting_date, ending_date },
  callingApp,
}: {
  activeYear: AcademicYearInterface;
  callingApp: 'admin' | 'personnel';
}) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const [academicYears, setAcademicYears] = useState<AcademicYearInterface[]>(
    []
  );
  const [isAcademciYearDialogOpen, setIsAcademicYearDialogOpen] =
    useState<boolean>(false);

  const [notifications, setNotifications] = useState<useNotification[]>();
  const [isFetchingAcademicYears, setIsFetchingAcademicYears] =
    useState<boolean>(false);

  const getAcademicYears = () => {
    if (isAcademciYearDialogOpen) {
      setIsFetchingAcademicYears(true);
      if (notifications)
        notifications.forEach((notification) => notification.dismiss());
      const newNotification = new useNotification();
      if (notifications) setNotifications([...notifications, newNotification]);
      else setNotifications([newNotification]);
      newNotification.notify({
        render: formatMessage({ id: 'fetchingAcademicYears' }),
      });
      //TODO: CALL getAcademicYears API HERE
      setTimeout(() => {
        setIsFetchingAcademicYears(false);
        if (random() > 5) {
          //TODO: SET DATA IN ACADEMIC YEAR STATE HERE
          const newAcademicYears: AcademicYearInterface[] = [
            {
              academic_year_id: 'https:qwoeiofs/sldie',
              code: 'YEAR-202100012022',
              ending_date: new Date(),
              starting_date: new Date(),
              year_status: 'inactive',
            },
            {
              academic_year_id: 'https:qwwoeios/sldie',
              code: 'YEAR-1',
              ending_date: new Date(),
              starting_date: new Date(),
              year_status: 'inactive',
            },
            {
              academic_year_id: 'https:qwoerios/sldie',
              code: 'YEAR-1',
              ending_date: new Date(),
              starting_date: new Date(),
              year_status: 'active',
            },
            {
              academic_year_id: 'https:qwoeios/sldige',
              code: 'YEAR-1',
              ending_date: new Date(),
              starting_date: new Date(),
              year_status: 'finished',
            },
          ];
          if (newAcademicYears.length > 1) {
            setAcademicYears(newAcademicYears);
            newNotification.dismiss();
          } else {
            newNotification.update({
              render: formatMessage({ id: 'onlyOneAcademicYear' }),
            });
            setIsAcademicYearDialogOpen(false);
          }
        } else {
          newNotification.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={getAcademicYears}
                notification={newNotification}
                message={formatMessage({ id: 'getAcademicYearsFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
        setIsFetchingAcademicYears(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getAcademicYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAcademciYearDialogOpen]);
  return (
    <>
      <SelectAcademicYearDialog
        academicYears={academicYears}
        closeDialog={() => {
          setIsAcademicYearDialogOpen(false);
          setAcademicYears([]);
        }}
        isDialogOpen={
          isAcademciYearDialogOpen &&
          academicYears.length > 1 &&
          !isFetchingAcademicYears
        }
        callingApp={callingApp}
      />
      <Box
        sx={{
          display: 'grid',
          justifyItems: 'center',
          rowGap: theme.spacing(1),
          marginTop: theme.spacing(2),
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 400 }}
        >{`${formatMessage({
          id: 'activeYear',
        })}: ${new Date(starting_date).getFullYear()} - ${new Date(
          ending_date
        ).getFullYear()}`}</Typography>
        <Button
          sx={{ textTransform: 'none' }}
          size="small"
          variant="outlined"
          color="primary"
          onClick={() =>
            isFetchingAcademicYears || isAcademciYearDialogOpen
              ? null
              : setIsAcademicYearDialogOpen(true)
          }
        >
          {isFetchingAcademicYears && isAcademciYearDialogOpen && (
            <CircularProgress
              thickness={3}
              size={20}
              sx={{ marginRight: theme.spacing(0.5) }}
            />
          )}
          {formatMessage({ id: 'changeActiveYear' })}
        </Button>
      </Box>
    </>
  );
}
