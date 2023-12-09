import { StaffRole } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import { Icon } from '@iconify/react';
import { Checkbox, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

export default function FilterMenu({
  closeMenu,
  anchorEl,
  isOpen,
  onSelect,
  selectedRoles,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onSelect: (role: StaffRole) => void;
  selectedRoles: StaffRole[];
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const MENU_ITEMS: StaffRole[] = [
    'CONFIGURATOR',
    'COORDINATOR',
    'REGISTRY',
    'TEACHER',
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isOpen}
      onClose={closeMenu}
    >
      {MENU_ITEMS.sort((a, b) => (a > b ? 1 : -1)).map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => onSelect(item)}
          sx={{
            backgroundColor: selectedRoles.includes(item)
              ? theme.common.blueTransparent
              : '',
          }}
        >
          <Stack direction="row" spacing={0} alignItems={'center'}>
            <Checkbox
              checked={selectedRoles.includes(item)}
              icon={
                <Icon
                  icon={unchecked}
                  style={{
                    color: '#D1D5DB',
                    height: '100%',
                    width: '24px',
                  }}
                />
              }
              checkedIcon={
                <Icon
                  icon={checked}
                  style={{
                    color: theme.palette.primary.main,
                    height: '100%',
                    width: '24px',
                  }}
                />
              }
            />
            <Typography
              sx={{
                color: selectedRoles.includes(item)
                  ? theme.palette.primary.main
                  : theme.common.body,
              }}
            >
              {formatMessage({ id: item.toLowerCase() })}
            </Typography>
          </Stack>
        </MenuItem>
      ))}
    </Menu>
  );
}
