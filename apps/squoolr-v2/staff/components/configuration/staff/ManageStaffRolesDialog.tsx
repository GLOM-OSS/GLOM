import { DialogTransition } from '@glom/components';
import {
  ManageStaffRolesPayload,
  StaffEntity,
  StaffRole,
} from '@glom/data-types';
import { useTheme } from '@glom/theme';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import { Icon } from '@iconify/react';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import CompleteTeacherInfoDialog from './CompleteTeacherInfoDialog';

export default function ManageStaffRolesDialog({
  isDialogOpen,
  closeDialog,
  staff: { annual_configurator_id, annual_registry_id, annual_teacher_id },
  staff,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  staff: StaffEntity;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [submitValue, setSubmitValue] = useState<ManageStaffRolesPayload>({
    newRoles: [],
    coordinatorPayload: { annualClassroomIds: [] },
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleteInfoDialogOpen, setIsCompleteInfoDialogOpen] =
    useState<boolean>(false);

  function confirmNewTeacherRole(
    data?: ManageStaffRolesPayload['teacherPayload']
    // close?: boolean
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
    } else if (doesTeacherDataExist) {
      if (submitValue.newRoles.includes('TEACHER'))
        setSubmitValue({
          ...submitValue,
          newRoles: submitValue.newRoles.filter((role) => role !== 'TEACHER'),
        });
      else
        setSubmitValue({
          ...submitValue,
          newRoles: [...submitValue.newRoles, 'TEACHER'],
        });
    } else {
      setIsCompleteInfoDialogOpen(true);
    }
  }

  function manageRole(role: StaffRole) {
    switch (role) {
      case 'TEACHER': {
        if (!!annual_teacher_id) {
          if (
            submitValue.disabledStaffPayload.registryIds.includes(
              annual_teacher_id
            )
          )
            setSubmitValue({
              ...submitValue,
              disabledStaffPayload: {
                ...submitValue.disabledStaffPayload,
                teacherIds: [],
              },
            });
          else
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

  return (
    <>
      <CompleteTeacherInfoDialog
        closeDialog={() => setIsCompleteInfoDialogOpen(false)}
        isDialogOpen={isCompleteInfoDialogOpen}
        confirm={(staff: ManageStaffRolesPayload['teacherPayload']) =>
          confirmNewTeacherRole(staff)
        }
      />
      <Dialog
        sx={{
          '& .MuiPaper-root': {
            padding: { laptop: '2% 10%', mobile: 0 },
          },
        }}
        TransitionComponent={DialogTransition}
        open={isDialogOpen && !isCompleteInfoDialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle>
          <>
            {formatMessage({ id: 'manageRoles' })}
            <Typography>attribute and remove roles here</Typography>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
