import { StaffRole } from '@glom/data-types';
import { useTheme } from '@glom/theme';
import edit from '@iconify/icons-fluent/edit-48-regular';
import key from '@iconify/icons-fluent/key-reset-24-regular';
import account from '@iconify/icons-fluent/person-accounts-24-regular';
import person from '@iconify/icons-fluent/person-48-regular';
import personProhibited from '@iconify/icons-fluent/person-prohibited-28-regular';
import personSync from '@iconify/icons-fluent/person-sync-48-regular';
import shield from '@iconify/icons-fluent/shield-task-48-regular';
import { Icon } from '@iconify/react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ManageStaffMenu({
  closeMenu,
  anchorEl,
  isOpen,
  isArchived = false,
  confirmArchive,
  confirmUnarchive,
  editStaff,
  manageRoles,
  resetPassword,
  resetPrivateCode,
  openDetails,
  staffRoles,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  confirmArchive: () => void;
  confirmUnarchive: () => void;
  editStaff: () => void;
  manageRoles: () => void;
  resetPassword: () => void;
  resetPrivateCode: () => void;
  openDetails: () => void;
  staffRoles: StaffRole[];
  isArchived?: boolean;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{
        vertical: 16,
        horizontal: 'right',
      }}
      open={isOpen}
      onClose={closeMenu}
    >
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            openDetails();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={person} fontSize={24} />
            <Typography>{formatMessage({ id: 'details' })}</Typography>
          </Stack>
        </MenuItem>
      )}
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            editStaff();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={edit} fontSize={24} />
            <Typography>{formatMessage({ id: 'edit' })}</Typography>
          </Stack>
        </MenuItem>
      )}
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            manageRoles();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={account} fontSize={24} />
            <Typography>{formatMessage({ id: 'manageRoles' })}</Typography>
          </Stack>
        </MenuItem>
      )}
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            resetPassword();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={key} fontSize={24} />
            <Typography>{formatMessage({ id: 'resetPassword' })}</Typography>
          </Stack>
        </MenuItem>
      )}
      {!isArchived &&
        (staffRoles.includes('TEACHER') || staffRoles.includes('REGISTRY')) && (
          <MenuItem
            onClick={() => {
              closeMenu();
              resetPrivateCode();
            }}
          >
            <Stack direction="row" spacing={1} alignItems={'center'}>
              <Icon icon={shield} fontSize={24} />
              <Typography>
                {formatMessage({ id: 'resetPrivateCode' })}
              </Typography>
            </Stack>
          </MenuItem>
        )}
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            confirmArchive();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon
              icon={personProhibited}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'archiveStaffMember' })}
            </Typography>
          </Stack>
        </MenuItem>
      )}
      {isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            confirmUnarchive();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon
              icon={personSync}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'revokeBan' })}
            </Typography>
          </Stack>
        </MenuItem>
      )}
    </Menu>
  );
}
