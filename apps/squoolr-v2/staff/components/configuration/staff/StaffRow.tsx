import { BulkDisableStaffPayload, StaffEntity } from '@glom/data-types';
import { useTheme } from '@glom/theme';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import { Icon } from '@iconify/react';
import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ManageStaffMenu from './ManageStaffMenu';
import StaffRoles from './StaffRoles';
import { ConfirmDialog } from '@glom/components';
import AddStaffDialog from './AddStaffDialog';

export default function StaffRow({
  staff: {
    roles,
    first_name,
    last_name,
    phone_number,
    email,
    last_connected,
    annual_configurator_id,
    annual_registry_id,
    annual_teacher_id,
  },
  staff,
  selectedStaff,
  selectStaff,
  showMoreIcon,
  disabled,
  showArchived,
}: {
  staff: StaffEntity;
  selectedStaff: Record<keyof BulkDisableStaffPayload, string[]>;
  selectStaff: (
    configuratorId?: string,
    registryId?: string,
    teacherId?: string
  ) => void;
  showMoreIcon: boolean;
  disabled: boolean;
  showArchived: boolean;
}) {
  const theme = useTheme();
  const { formatDate, formatMessage } = useIntl();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [
    isConfirmResetPasswordDialogOpen,
    setIsConfirmResetPasswordDialogOpen,
  ] = useState<boolean>(false);
  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isResettingStaffPassword, setIsResettingStaffPassword] =
    useState<boolean>(false);
  function confirmResetPassword() {
    //TODO: CALL API HERE RESET USER PASSWORD WITH DATA staff.login_id
    setIsResettingStaffPassword(true);
    setTimeout(() => {
      alert('done resetting password');
      setIsResettingStaffPassword(false);
      setIsConfirmResetPasswordDialogOpen(false);
    }, 3000);
  }

  const [
    isConfirmResetPrivateCodeDialogOpen,
    setIsConfirmResetPrivateCodeDialogOpen,
  ] = useState<boolean>(false);
  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isResettingStaffPrivateCode, setIsResettingStaffPrivateCode] =
    useState<boolean>(false);
  function confirmResetPrivateCode() {
    //TODO: CALL API HERE RESET USER private code WITH DATA staff.annual_teacher_id or staff.annual_registry_id
    setIsResettingStaffPrivateCode(true);
    setTimeout(() => {
      alert('done resetting private code');
      setIsResettingStaffPrivateCode(false);
      setIsConfirmResetPrivateCodeDialogOpen(false);
    }, 3000);
  }

  const [isConfirmArchiveDialogOpen, setIsConfirmArchiveDialogOpen] =
    useState<boolean>(false);
  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  function confirmArchive() {
    //TODO: CALL API HERE archive user WITH DATA staff.annual_teacher_id and/or staff.annual_registry_id and/or annual_configurator_id
    setIsArchiving(true);
    setTimeout(() => {
      alert('done archiving');
      setIsArchiving(false);
      setIsConfirmArchiveDialogOpen(false);
    }, 3000);
  }

  const [isConfirmUnarchiveDialogOpen, setIsConfirmUnarchiveDialogOpen] =
    useState<boolean>(false);
  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  function confirmUnarchive() {
    //TODO: CALL API HERE unarchive user WITH DATA staff.annual_teacher_id and/or staff.annual_registry_id and/or annual_configurator_id
    setIsUnarchiving(true);
    setTimeout(() => {
      alert('done unarchiving');
      setIsUnarchiving(false);
      setIsConfirmUnarchiveDialogOpen(false);
    }, 3000);
  }

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  return (
    <>
      <ManageStaffMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        confirmArchive={() => setIsConfirmArchiveDialogOpen(true)}
        confirmUnarchive={() => setIsConfirmUnarchiveDialogOpen(true)}
        editStaff={() => setIsEditDialogOpen(true)}
        isOpen={!!anchorEl}
        openDetails={() => alert('open details')}
        manageRoles={() => alert('manage roles')}
        resetPassword={() => setIsConfirmResetPasswordDialogOpen(true)}
        resetPrivateCode={() => setIsConfirmResetPrivateCodeDialogOpen(true)}
        isArchived={showArchived}
        staffRoles={roles}
      />
      <AddStaffDialog
        closeDialog={() => setIsEditDialogOpen(false)}
        isDialogOpen={isEditDialogOpen && !roles.includes('TEACHER')}
        usage={roles.includes('CONFIGURATOR') ? 'CONFIGURATOR' : 'REGISTRY'}
        staff={staff}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmResetPasswordDialogOpen(false)}
        confirm={confirmResetPassword}
        dialogMessage={formatMessage({
          id: 'confirmResetStaffPasswordDialogMessage',
        })}
        isDialogOpen={isConfirmResetPasswordDialogOpen}
        closeOnConfirm
        confirmButton={formatMessage({ id: 'resetPassword' })}
        danger
        dialogTitle={formatMessage({ id: 'resetStaffPassword' })}
        isSubmitting={isResettingStaffPassword}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmResetPrivateCodeDialogOpen(false)}
        confirm={confirmResetPrivateCode}
        dialogMessage={formatMessage({
          id: 'confirmResetStaffPrivateCodeDialogMessage',
        })}
        isDialogOpen={isConfirmResetPrivateCodeDialogOpen}
        closeOnConfirm
        confirmButton={formatMessage({ id: 'resetPrivateCode' })}
        danger
        dialogTitle={formatMessage({ id: 'resetStaffPrivateCode' })}
        isSubmitting={isResettingStaffPrivateCode}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmArchiveDialogOpen(false)}
        confirm={confirmArchive}
        dialogMessage={formatMessage({
          id: 'confirmArchiveStaffDialogMessage',
        })}
        isDialogOpen={isConfirmArchiveDialogOpen}
        closeOnConfirm
        confirmButton={formatMessage({ id: 'ban' })}
        danger
        dialogTitle={formatMessage({ id: 'archiveStaffMember' })}
        isSubmitting={isArchiving}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmUnarchiveDialogOpen(false)}
        confirm={confirmUnarchive}
        dialogMessage={formatMessage({
          id: 'confirmUnarchiveStaffDialogMessage',
        })}
        isDialogOpen={isConfirmUnarchiveDialogOpen}
        closeOnConfirm
        confirmButton={formatMessage({ id: 'revokeBan' })}
        danger
        dialogTitle={formatMessage({ id: 'unarchiveStaffMember' })}
        isSubmitting={isUnarchiving}
      />
      <TableRow
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          '& td': {
            padding: '7px',
          },
        }}
      >
        <TableCell>
          <Checkbox
            checked={
              annual_configurator_id
                ? selectedStaff.configuratorIds.includes(annual_configurator_id)
                : annual_registry_id
                ? selectedStaff.registryIds.includes(annual_registry_id)
                : annual_teacher_id
                ? selectedStaff.teacherIds.includes(annual_teacher_id)
                : false
            }
            onClick={() =>
              selectStaff(
                annual_configurator_id,
                annual_registry_id,
                annual_teacher_id
              )
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
        </TableCell>
        <TableCell
          sx={{
            color: showArchived ? theme.common.line : theme.common.body,
          }}
        >
          {`${first_name} ${last_name}`}
        </TableCell>
        <TableCell
          sx={{
            color: showArchived ? theme.common.line : theme.common.body,
          }}
        >
          {phone_number.split('+')[1]?.replace(/(.{3})/g, ' $1')}
        </TableCell>
        <TableCell
          sx={{
            color: showArchived
              ? theme.common.line
              : theme.palette.primary.main,
          }}
        >
          {email}
        </TableCell>
        <TableCell
          sx={{
            color: showArchived ? theme.common.line : theme.common.body,
          }}
        >
          <StaffRoles roles={roles} />
        </TableCell>
        <TableCell
          sx={{
            color: showArchived ? theme.common.line : theme.common.body,
          }}
        >
          {formatDate(last_connected, {
            weekday: 'short',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            year: '2-digit',
            day: '2-digit',
          })}
        </TableCell>
        <TableCell align="right">
          {showMoreIcon ? (
            ''
          ) : (
            <Tooltip arrow title={formatMessage({ id: 'more' })}>
              <IconButton
                size="small"
                disabled={disabled}
                onClick={(event) => {
                  if (disabled) return null;
                  setAnchorEl(event.currentTarget);
                }}
              >
                <Icon icon={more} />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
