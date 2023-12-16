import { useTheme } from '@glom/theme';
import trash from '@iconify/icons-fluent/delete-48-regular';
import lock from '@iconify/icons-fluent/lock-closed-48-regular';
import { Icon } from '@iconify/react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function ManageConfiguratorMenu({
  closeMenu,
  anchorEl,
  isOpen,
  isDisabled,
  onDisableAccount,
  onEnableAccount,
  onResetPassword,
}: {
  closeMenu: () => void;
  isDisabled: boolean;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onDisableAccount: () => void;
  onEnableAccount: () => void;
  onResetPassword: () => void;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{
        vertical: 12,
        horizontal: 170,
      }}
      open={isOpen}
      onClose={closeMenu}
    >
      <MenuItem
        onClick={() => {
          closeMenu();
          onResetPassword();
        }}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Icon icon={lock} fontSize={24} />
          <Typography>{formatMessage({ id: 'resetPassword' })}</Typography>
        </Stack>
      </MenuItem>
      {!isDisabled && (
        <MenuItem
          onClick={() => {
            onDisableAccount();
            closeMenu();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon
              icon={trash}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'disableAccount' })}
            </Typography>
          </Stack>
        </MenuItem>
      )}
      {isDisabled && (
        <MenuItem
          onClick={() => {
            onEnableAccount();
            closeMenu();
          }}
        >
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <Icon
              icon={trash}
              fontSize={24}
              style={{ color: theme.palette.warning.main }}
            />
            <Typography sx={{ color: theme.palette.warning.main }}>
              {formatMessage({ id: 'enableAccount' })}
            </Typography>
          </Stack>
        </MenuItem>
      )}
    </Menu>
  );
}
