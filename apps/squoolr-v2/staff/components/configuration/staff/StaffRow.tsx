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

  return (
    <>
      <ManageStaffMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        confirmArchive={() => alert('archive')}
        confirmUnarchive={() => alert('unarchive')}
        editStaff={() => alert('edit')}
        isOpen={!!anchorEl}
        manageRoles={() => alert('manage roles')}
        resetPassword={() => setIsConfirmResetPasswordDialogOpen(true)}
        resetPrivateCode={() => alert('reset private code')}
        isArchived={showArchived}
        staffRoles={roles}
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
