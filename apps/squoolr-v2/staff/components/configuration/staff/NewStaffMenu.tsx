import add from '@iconify/icons-fluent/add-circle-32-regular';
import { Icon } from '@iconify/react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function NewStaffMenu({
  closeMenu,
  anchorEl,
  isOpen,
  addTeacher,
  addConfigurator,
  addRegistry,
  addCoordinator,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  addTeacher: () => void;
  addConfigurator: () => void;
  addRegistry: () => void;
  addCoordinator: () => void;
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{
        vertical: 230,
        horizontal: 190,
      }}
      open={isOpen}
      onClose={closeMenu}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: '#040303',
          opacity: `0.4 !important`,
        },
      }}
    >
      <MenuItem
        onClick={() => {
          closeMenu();
          addTeacher();
        }}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Icon icon={add} fontSize={24} />
          <Typography>{formatMessage({ id: 'addTeacher' })}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem
        onClick={() => {
          closeMenu();
          addConfigurator();
        }}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Icon icon={add} fontSize={24} />
          <Typography>{formatMessage({ id: 'addConfigurator' })}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem
        onClick={() => {
          closeMenu();
          addRegistry();
        }}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Icon icon={add} fontSize={24} />
          <Typography>{formatMessage({ id: 'addRegistry' })}</Typography>
        </Stack>
      </MenuItem>
      <MenuItem
        onClick={() => {
          closeMenu();
          addCoordinator();
        }}
      >
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Icon icon={add} fontSize={24} />
          <Typography>{formatMessage({ id: 'addCoordinator' })}</Typography>
        </Stack>
      </MenuItem>
    </Menu>
  );
}
