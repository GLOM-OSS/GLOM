import { DialogTransition } from '@glom/components';
import {
  useClassrooms,
  useManageStaffRoles,
  useStaffMember,
} from '@glom/data-access/squoolr';
import {
  ClassroomEntity,
  CoordinatorEntity,
  ManageStaffRolesPayload,
  StaffEntity,
  StaffRole,
} from '@glom/data-types';
import { useTheme } from '@glom/theme';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import { Icon } from '@iconify/react';
import { ArrowDropDown } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import CompleteTeacherInfoDialog from './CompleteTeacherInfoDialog';

export default function ManageStaffRolesDialog({
  isDialogOpen,
  closeDialog,
  staff: {
    annual_configurator_id,
    annual_registry_id,
    annual_teacher_id,
    login_id,
  },
  staff,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  staff: StaffEntity;
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { data: coordinator } = useStaffMember<CoordinatorEntity>(
    staff.annual_teacher_id,
    'COORDINATOR'
  );
  const [submitValue, setSubmitValue] = useState<ManageStaffRolesPayload>({
    newRoles: [],
    coordinatorPayload: {
      annualClassroomIds: [
        ...(coordinator?.annualClassroomIds
          ? coordinator.annualClassroomIds
          : []),
      ],
    },
    disabledStaffPayload: {
      configuratorIds: [],
      teacherIds: [],
      registryIds: [],
    },
    teacherPayload: {
      ...staff,
      role: 'TEACHER',
      has_signed_convention: false,
      has_tax_payers_card: false,
      hourly_rate: 0,
      origin_institute: '',
      teacher_type_id: '',
      teaching_grade_id: '',
    },
  });

  function confirmNewTeacherRole(
    data?: ManageStaffRolesPayload['teacherPayload']
  ) {
    const doesTeacherDataExist =
      !!submitValue.teacherPayload.hourly_rate &&
      !!submitValue.teacherPayload.origin_institute &&
      !!submitValue.teacherPayload.teacher_type_id &&
      !!submitValue.teacherPayload.teaching_grade_id;

    if (!!data && !doesTeacherDataExist) {
      setSubmitValue({
        ...submitValue,
        teacherPayload: { ...data, role: 'TEACHER' },
        newRoles: [...submitValue.newRoles, 'TEACHER'],
      });
    } else {
      if (submitValue.newRoles.includes('TEACHER')) {
        setSubmitValue({
          ...submitValue,
          newRoles: submitValue.newRoles.filter((role) => role !== 'TEACHER'),
        });
        if (!!coordinator.annualClassroomIds) {
          setNewClassrooms(
            classrooms.filter(({ annual_classroom_id: ac_id }) =>
              coordinator.annualClassroomIds.includes(ac_id)
            )
          );
        }
      } else
        setSubmitValue({
          ...submitValue,
          newRoles: [...submitValue.newRoles, 'TEACHER'],
        });
    }
  }

  function manageRole(role: StaffRole) {
    switch (role) {
      case 'TEACHER': {
        if (!!annual_teacher_id) {
          if (
            submitValue.disabledStaffPayload.teacherIds.includes(
              annual_teacher_id
            )
          ) {
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                teacherIds: [],
              },
            });
            if (!!coordinator.annualClassroomIds)
              setNewClassrooms(
                classrooms.filter(({ annual_classroom_id: ac_id }) =>
                  coordinator.annualClassroomIds.includes(ac_id)
                )
              );
          } else
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                teacherIds: [annual_teacher_id],
              },
            });
        } else {
          confirmNewTeacherRole();
        }
        break;
      }
      case 'REGISTRY': {
        if (!!annual_registry_id) {
          if (
            submitValue.disabledStaffPayload.registryIds.includes(
              annual_registry_id
            )
          )
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                registryIds: [],
              },
            });
          else
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                registryIds: [annual_registry_id],
              },
            });
        } else {
          if (submitValue.newRoles.includes('REGISTRY'))
            setSubmitValue({
              ...submitValue,
              newRoles: submitValue.newRoles.filter(
                (role) => role !== 'REGISTRY'
              ),
            });
          else
            setSubmitValue({
              ...submitValue,
              newRoles: [...submitValue.newRoles, 'REGISTRY'],
            });
        }
        break;
      }
      case 'CONFIGURATOR': {
        if (!!annual_configurator_id) {
          if (
            submitValue.disabledStaffPayload.configuratorIds.includes(
              annual_configurator_id
            )
          )
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                configuratorIds: [],
              },
            });
          else
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                configuratorIds: [annual_configurator_id],
              },
            });
        } else {
          if (submitValue.newRoles.includes('CONFIGURATOR'))
            setSubmitValue({
              ...submitValue,
              newRoles: submitValue.newRoles.filter(
                (role) => role !== 'CONFIGURATOR'
              ),
            });
          else
            setSubmitValue({
              ...submitValue,
              newRoles: [...submitValue.newRoles, 'CONFIGURATOR'],
            });
        }
        break;
      }
    }
  }

  const { data: classrooms, isFetching: isFetchingClassrooms } =
    useClassrooms();

  const [newClassrooms, setNewClassrooms] = useState<ClassroomEntity[]>([]);

  useEffect(() => {
    if (!!classrooms && !!coordinator.annualClassroomIds) {
      setNewClassrooms(
        classrooms.filter(({ annual_classroom_id: ac_id }) =>
          coordinator.annualClassroomIds.includes(ac_id)
        )
      );
    }
  }, [classrooms, coordinator.annualClassroomIds, isDialogOpen]);

  const [isCompleteInfoDialogOpen, setIsCompleteInfoDialogOpen] =
    useState<boolean>(false);

  const { mutate: manageStaffRoles, isPending: isSubmitting } =
    useManageStaffRoles(login_id);
  function submitManageRoles() {
    const submitValues: ManageStaffRolesPayload = {
      ...submitValue,
      teacherPayload: undefined,
      coordinatorPayload: {
        annualClassroomIds: newClassrooms.map(
          ({ annual_classroom_id }) => annual_classroom_id
        ),
      },
    };
    manageStaffRoles(submitValues, {
      onSuccess(data) {
        if (data.next_action && submitValues.newRoles.includes('TEACHER')) {
          setIsCompleteInfoDialogOpen(true);
        } else close();
      },
    });
  }

  function submitTeacherData(staff: ManageStaffRolesPayload['teacherPayload']) {
    const submitValues: ManageStaffRolesPayload = {
      ...submitValue,
      teacherPayload: { ...staff, role: 'TEACHER' },
      coordinatorPayload: {
        annualClassroomIds: newClassrooms.map(
          ({ annual_classroom_id }) => annual_classroom_id
        ),
      },
    };

    manageStaffRoles(submitValues, {
      onSuccess() {
        close();
      },
    });
  }

  function close() {
    setSubmitValue({
      newRoles: [],
      coordinatorPayload: { annualClassroomIds: [] },
      disabledStaffPayload: {
        configuratorIds: [],
        registryIds: [],
        teacherIds: [],
      },
      teacherPayload: {
        role: 'TEACHER',
        has_signed_convention: false,
        has_tax_payers_card: false,
        hourly_rate: 0,
        origin_institute: '',
        teacher_type_id: '',
        teaching_grade_id: '',
      },
    });
    setNewClassrooms([]);
    closeDialog();
    setIsCompleteInfoDialogOpen(false);
  }

  function areCoordinatedClassroomsSame() {
    const ac_ids = newClassrooms.map(({ annual_classroom_id: ac_id }) => ac_id);
    const initialClassrooms = coordinator.annualClassroomIds ?? [];

    return (
      ac_ids.sort((a, b) => (a > b ? 1 : -1)).join('*') ===
      initialClassrooms.sort((a, b) => (a > b ? 1 : -1)).join('*')
    );
  }

  function areThereAnyDisabledRoles() {
    return (
      submitValue.disabledStaffPayload.configuratorIds.length > 0 ||
      submitValue.disabledStaffPayload.registryIds.length > 0 ||
      submitValue.disabledStaffPayload.teacherIds.length > 0
    );
  }

  return (
    <>
      <CompleteTeacherInfoDialog
        closeDialog={() => setIsCompleteInfoDialogOpen(false)}
        isDialogOpen={isCompleteInfoDialogOpen}
        isSubmitting={isSubmitting}
        confirm={submitTeacherData}
      />
      <Dialog
        sx={{
          '& .MuiPaper-root': {
            padding: { laptop: '2% 10%', mobile: 0 },
          },
        }}
        TransitionComponent={DialogTransition}
        open={isDialogOpen && !isCompleteInfoDialogOpen}
        onClose={close}
      >
        <DialogTitle>
          <>
            {formatMessage({ id: 'manageRoles' })}
            <Typography>
              {formatMessage({ id: 'manageRolesSubHeading' })}
            </Typography>
          </>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <Typography>{formatMessage({ id: 'configurator' })}</Typography>
            <Checkbox
              disabled={isSubmitting}
              onClick={() => (isSubmitting ? null : manageRole('CONFIGURATOR'))}
              checked={
                (!!annual_configurator_id &&
                  !submitValue.disabledStaffPayload.configuratorIds.includes(
                    annual_configurator_id
                  )) ||
                (!annual_configurator_id &&
                  submitValue.newRoles.includes('CONFIGURATOR'))
              }
              icon={
                <Icon
                  icon={unchecked}
                  style={{
                    color: '#D1D5DB',
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
              checkedIcon={
                <Icon
                  icon={checked}
                  style={{
                    color: theme.palette.primary.main,
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <Typography>{formatMessage({ id: 'registry' })}</Typography>
            <Checkbox
              disabled={isSubmitting}
              onClick={() => (isSubmitting ? null : manageRole('REGISTRY'))}
              checked={
                (!!annual_registry_id &&
                  !submitValue.disabledStaffPayload.registryIds.includes(
                    annual_registry_id
                  )) ||
                (!annual_registry_id &&
                  submitValue.newRoles.includes('REGISTRY'))
              }
              icon={
                <Icon
                  icon={unchecked}
                  style={{
                    color: '#D1D5DB',
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
              checkedIcon={
                <Icon
                  icon={checked}
                  style={{
                    color: theme.palette.primary.main,
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <Typography>{formatMessage({ id: 'teacher' })}</Typography>
            <Checkbox
              disabled={isSubmitting}
              onClick={() => (isSubmitting ? null : manageRole('TEACHER'))}
              checked={
                (!!annual_teacher_id &&
                  !submitValue.disabledStaffPayload.teacherIds.includes(
                    annual_teacher_id
                  )) ||
                (!annual_teacher_id && submitValue.newRoles.includes('TEACHER'))
              }
              icon={
                <Icon
                  icon={unchecked}
                  style={{
                    color: '#D1D5DB',
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
              checkedIcon={
                <Icon
                  icon={checked}
                  style={{
                    color: theme.palette.primary.main,
                    height: '100%',
                    width: '21px',
                  }}
                />
              }
            />
          </Box>
          <Box
            component={Collapse}
            in={
              (!!annual_teacher_id &&
                !submitValue.disabledStaffPayload.teacherIds.includes(
                  annual_teacher_id
                )) ||
              (!annual_teacher_id && submitValue.newRoles.includes('TEACHER'))
            }
            sx={{ paddingTop: '12px' }}
          >
            <Typography
              sx={{ color: `${theme.common.titleActive} !important` }}
              className="p1"
            >
              {formatMessage({ id: 'coordinator' })}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              {formatMessage({ id: 'selectedCoordinatedClassrooms' })}
            </Typography>
            <Autocomplete
              multiple
              options={classrooms ?? []}
              autoHighlight
              size="small"
              disabled={isSubmitting || !classrooms || isFetchingClassrooms}
              value={newClassrooms}
              popupIcon={
                isFetchingClassrooms ? (
                  <CircularProgress color="primary" size={18} />
                ) : (
                  <ArrowDropDown />
                )
              }
              getOptionLabel={(option) => {
                const { classroom_acronym, classroom_level } =
                  option as ClassroomEntity;
                return `${classroom_acronym} ${classroom_level}`;
              }}
              renderOption={(
                props,
                { classroom_acronym, classroom_level, annual_classroom_id }
              ) => {
                return (
                  <Typography
                    {...props}
                    key={annual_classroom_id}
                    component="li"
                  >{`${classroom_acronym} ${classroom_level}`}</Typography>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={formatMessage({ id: 'selectClassrooms' })}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'autocomplete',
                  }}
                />
              )}
              onChange={(e, val) => setNewClassrooms(val)}
            />
          </Box>
          <DialogActions>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => (isSubmitting ? null : close())}
              disabled={isSubmitting}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={
                isSubmitting ||
                (areCoordinatedClassroomsSame() &&
                  submitValue.newRoles.length === 0 &&
                  !areThereAnyDisabledRoles())
              }
              onClick={submitManageRoles}
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
