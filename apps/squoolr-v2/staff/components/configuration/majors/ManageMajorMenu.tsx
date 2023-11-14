import { useTheme } from '@glom/theme';
import archive from '@iconify/icons-fluent/archive-48-regular';
import edit from '@iconify/icons-fluent/edit-48-regular';
import receipt from '@iconify/icons-fluent/receipt-32-regular';
import { Icon } from '@iconify/react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ManageMajorMenu({
  closeMenu,
  anchorEl,
  isOpen,
  isArchived = false,
  confirmArchive,
  confirmUnarchive,
  openClassrooms,
  editMajor,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  confirmArchive: () => void;
  confirmUnarchive: () => void;
  openClassrooms: () => void;
  editMajor: () => void;
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
            openClassrooms();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={receipt} fontSize={24} />
            <Typography>{formatMessage({ id: 'goToClasses' })}</Typography>
          </Stack>
        </MenuItem>
      )}
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            editMajor();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={edit} fontSize={24} />
            <Typography>{formatMessage({ id: 'editMajor' })}</Typography>
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
              icon={archive}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'archive' })}
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
              icon={archive}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'unarchive' })}
            </Typography>
          </Stack>
        </MenuItem>
      )}
    </Menu>
  );
}
