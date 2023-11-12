import { useTheme } from '@glom/theme';
import archive from '@iconify/icons-fluent/archive-48-regular';
import edit from '@iconify/icons-fluent/edit-48-regular';
import { Icon } from '@iconify/react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ManageDepartmentMenu({
  closeMenu,
  anchorEl,
  isOpen,
  isArchived = false,
  confirmArchive,
  confirmUnarchive,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  confirmArchive: () => void;
  confirmUnarchive: () => void;
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
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '5px',
          boxShadow: 'none',
          border: `1px solid ${theme.common.line}`,
        },
      }}
    >
      {!isArchived && (
        <MenuItem
          onClick={() => {
            closeMenu();
            alert('Edit Department');
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon icon={edit} fontSize={24} />
            <Typography>{formatMessage({ id: 'editDepartment' })}</Typography>
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
