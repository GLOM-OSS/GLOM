import {
  Box,
  Dialog,
  IconButton,
  lighten,
  Tooltip,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import AcademicYear from '../components/AcademicYear';
import favicon from './logo.png';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { CloseRounded, ReportRounded } from '@mui/icons-material';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAcademicYearRoles } from '@squoolr/api-services';
import { useUser } from '@squoolr/layout';
import { AcademicYearInterface } from '@squoolr/interfaces';



export function SelectAcademicYearDialog({
  academicYears,
  closeDialog,
  isDialogOpen,
  callingApp,
}: {
  academicYears: AcademicYearInterface[];
  isDialogOpen: boolean;
  closeDialog: () => void;
  callingApp?: 'admin' | 'personnel';
}) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { userDispatch, ...user } = useUser();

  const [notifications, setNotifications] = useState<useNotification[]>();
  const [selectedAcademicYearId, setSelectedAcademicYearId] =
    useState<string>('');
  const navigate = useNavigate();

  const handleSelectAcademicYear = (academic_year_id: string) => {
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const newNotification = new useNotification();
    if (notifications) setNotifications([...notifications, newNotification]);
    else setNotifications([newNotification]);
    newNotification.notify({
      render: formatMessage({ id: 'gettingAcademicYear' }),
    });
    setSelectedAcademicYearId(academic_year_id);
    getAcademicYearRoles(academic_year_id)
      .then((userRoles) => {
        userDispatch({
          type: 'LOAD_USER',
          payload: { user: { ...user, ...userRoles } },
        });
        newNotification.update({
          render: formatMessage({ id: 'academicYearSet' }),
        });
        navigate('/dashboard');
        closeDialog();
      })
      .catch((error) => {
        newNotification.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => handleSelectAcademicYear(academic_year_id)}
              notification={newNotification}
              message={
                error?.message ||
                formatMessage({ id: 'failedToSetAcademicYear' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
        setSelectedAcademicYearId('');
      });
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
      fullScreen
      // sx={{ position: 'relative' }}
    >
      {callingApp === 'personnel' && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 7,
            right: 10,
            border: `1px solid ${theme.common.placeholder}`,
          }}
          onClick={closeDialog}
        >
          <Tooltip arrow title={formatMessage({ id: 'close' })}>
            <CloseRounded
              sx={{ color: theme.common.placeholder, fontSize: 25 }}
            />
          </Tooltip>
        </IconButton>
      )}
      <Box
        sx={{
          height: '100%',
          color: theme.common.titleActive,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          padding: '5% 3%',
        }}
      >
        <img
          src={favicon}
          alt="Squoolr icon"
          style={{ justifySelf: 'center' }}
        />
        <Box
          sx={{
            padding: `${theme.spacing(5)} ${theme.spacing(7.5)}`,
            display: 'grid',
            justifyItems: 'center',
            paddingTop: theme.spacing(11.25),
            gridTemplateRows: 'auto auto 1fr',
            height: '100%',
          }}
        >
          <Typography variant="h2">
            {formatMessage({ id: 'selectAcademicYear' })}
          </Typography>
          <Typography sx={{ marginBottom: theme.spacing(6.25) }}>
            {formatMessage({
              id: 'selectAcademicYearSubtitle',
            })}
          </Typography>
          <Box
            sx={{
              height: '100%',
              justifySelf: 'stretch',
              display: 'grid',
              justifyItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '1520px',
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
              }}
            >
              <Box
                sx={{
                  padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
                  display: 'grid',
                  columnGap: theme.spacing(10),
                  gridTemplateColumns: '155px 1fr 1fr 8ch',
                  borderRadius: theme.spacing(1),
                  backgroundColor: lighten(theme.palette.primary.light, 0.6),
                }}
              >
                <Typography sx={{ width: '17ch' }}>
                  {formatMessage({ id: 'code' })}
                </Typography>
                <Typography>{formatMessage({ id: 'startingDate' })}</Typography>
                <Typography>{formatMessage({ id: 'endDate' })}</Typography>
                <Typography>{formatMessage({ id: 'status' })}</Typography>
              </Box>
              {academicYears.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'center', marginTop: theme.spacing(3.125) }}
                >
                  {formatMessage({ id: 'youExistInNoAcademicYear' })}
                </Typography>
              )}
              {academicYears.length > 0 && (
                <Scrollbars>
                  {academicYears.map((academicYear, index) => (
                    <AcademicYear
                      key={index}
                      academicYear={academicYear}
                      handleSelectAcademicYear={handleSelectAcademicYear}
                      selectedAcademicYearId={selectedAcademicYearId}
                    />
                  ))}
                </Scrollbars>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

/*
selectAcademicYear:'Select Academic Year',
selectAcademicYearSubtitle:'Select an academic year to work in'
code:'#Code',
startingDate: 'Starting date',
endDate: 'End date',
status: 'Status',
youExistInNoAcademicYear:'We found no academic year related to this account',
finished:'Finished',
inactive:'Inactive',
active:'Active',
gettingAcademicYear:'Please wait while we set your selected academic year',
academicYearSet:'Your work session is ready to go. Have a great work time!',
failedToSetAcademicYear: "Something went wrong. We failed to set your academic year. Please try again!"
*/
