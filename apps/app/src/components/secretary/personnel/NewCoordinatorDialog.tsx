import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  lighten,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import {
  getClassrooms as fetchClassrooms,
  getTeachers as fetchTeachers,
} from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import {
  ErrorMessage,
  filterNotificationUsage,
  NotificationInterface,
  useNotification,
} from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ClassroomInterface } from '../classrooms';
import { PersonnelInterface } from './PersonnelRow';

export default function NewCoordinatorDialog({
  close,
  handleConfirm,
  isDialogOpen,
}: {
  close: () => void;
  handleConfirm: (submitData: {
    selectedTeacherId: string;
    selectedClassrooms: ClassroomInterface[];
  }) => void;
  isDialogOpen: boolean;
}) {
  const { formatMessage } = useIntl();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const closeDialog = () => {
    close();
    setSelectedTeacherId('');
  };

  const [teachers, setTeachers] = useState<PersonnelInterface[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<
    ClassroomInterface[]
  >([]);

  const [areTeachersLoading, setAreTeachersLoading] = useState<boolean>(false);
  const [areClassroomsLoading, setAreClassroomsLoading] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  const getTeachers = () => {
    setAreTeachersLoading(true);

    const notif = new useNotification();
    setNotifications(
      filterNotificationUsage('loadTeachers', notif, notifications)
    );

    fetchTeachers({ is_deleted: false })
      .then((teachers) => {
        setTeachers(
          teachers.map(
            ({
              personnel_id,
              personnel_code,
              phone_number,
              first_name,
              email,
              last_connected,
              last_name,
              login_id,
              birthdate,
              gender,
              national_id_number,
              address,
              roles,
            }) => ({
              personnel_id,
              personnel_code,
              first_name,
              last_connected,
              last_name,
              email,
              login_id,
              birthdate,
              gender,
              national_id_number,
              address,
              is_academic_service: roles.includes('S.A.'),
              is_coordo: roles.includes('Co'),
              is_secretariat: roles.includes('Se'),
              is_teacher: roles.includes('Te'),
              phone_number: phone_number,
              is_archived: false,
            })
          )
        );
        setAreTeachersLoading(false);
        notif.dismiss();
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingTeachers' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getTeachers}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'failedToLoadTeachers' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };
  const getClassrooms = () => {
    setAreClassroomsLoading(true);

    const notif = new useNotification();
    setNotifications(
      filterNotificationUsage('loadClassrooms', notif, notifications)
    );

    fetchClassrooms({ is_deleted: false })
      .then((classrooms) => {
        setClassrooms(classrooms);
        setAreClassroomsLoading(false);
        notif.dismiss();
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingClassrooms' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getClassrooms}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'failedToLoadClassrooms' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (isDialogOpen) {
      getTeachers();
      getClassrooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle>{formatMessage({ id: 'addNewCoordninator' })}</DialogTitle>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm({ selectedClassrooms, selectedTeacherId });
          closeDialog();
        }}
      >
        <DialogContent sx={{ display: 'grid', gridAutoFlow: 'row' }}>
          <TextField
            select
            autoFocus
            placeholder={formatMessage({ id: 'enterPersonnelCode' })}
            fullWidth
            required
            disabled={areTeachersLoading}
            value={selectedTeacherId}
            onChange={(event) => setSelectedTeacherId(event.target.value)}
          >
            {teachers.map(
              ({ first_name, last_name, personnel_code }, index) => (
                <MenuItem key={index} value={personnel_code}>
                  {`${first_name} ${last_name}`}
                </MenuItem>
              )
            )}
          </TextField>
          <FormControl sx={{ m: 1 }}>
            <InputLabel>{formatMessage({ id: 'majors' })}</InputLabel>
            <Select
              multiple
              value={selectedClassrooms}
              required
              fullWidth
              disabled={areClassroomsLoading}
              onChange={(event) => {
                const value = JSON.stringify(event.target.value).split(',');
                const classroom_code = JSON.parse(
                  value.length > 1
                    ? value[value.length - 1].split(']')[0]
                    : value[0]
                ).toString();
                const newClassroom = classrooms.find(
                  ({ classroom_code: cc }) => cc === classroom_code
                );
                if (newClassroom) {
                  if (
                    selectedClassrooms.find(
                      ({ classroom_code: cc }) => cc === classroom_code
                    )
                  ) {
                    setSelectedClassrooms(
                      selectedClassrooms.filter(
                        ({ classroom_code: cc }) => cc !== classroom_code
                      )
                    );
                  } else
                    setSelectedClassrooms([
                      ...selectedClassrooms,
                      newClassroom,
                    ]);
                }
              }}
              input={<OutlinedInput label={formatMessage({ id: 'majors' })} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(
                    ({ classroom_name, classroom_level }, index) => (
                      <Chip
                        key={index}
                        label={`${classroom_name} ${classroom_level}`}
                      />
                    )
                  )}
                </Box>
              )}
            >
              {classrooms.map(
                (
                  { classroom_code, classroom_name, classroom_level },
                  index
                ) => (
                  <MenuItem
                    sx={{
                      backgroundColor: selectedClassrooms.find(
                        ({ classroom_code: cc }) => cc === classroom_code
                      )
                        ? lighten(theme.palette.primary.main, 0.9)
                        : 'none',
                      '&:hover': {
                        backgroundColor: selectedClassrooms.find(
                          ({ classroom_code: cc }) => cc === classroom_code
                        )
                          ? lighten(theme.palette.primary.main, 0.8)
                          : lighten(theme.palette.primary.main, 0.96),
                      },
                    }}
                    key={index}
                    value={classroom_code}
                  >
                    {`${classroom_name}-${classroom_level}`}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="text"
            onClick={closeDialog}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            type="submit"
            disabled={
              selectedTeacherId === '' || selectedClassrooms.length === 0
            }
          >
            {formatMessage({ id: 'confirm' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
