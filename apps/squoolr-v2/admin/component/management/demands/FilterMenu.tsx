import { Checkbox, Menu, MenuItem, Stack, Typography } from '@mui/material';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import { Icon } from '@iconify/react';
import { useTheme } from '@glom/theme';
import { useIntl } from 'react-intl';
import { SchoolEntity } from '@glom/data-types/squoolr';

export default function FilterMenu({
  closeMenu,
  anchorEl,
  isOpen,
  onSelect,
  selectedStatus,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onSelect: (status: string) => void;
  selectedStatus: (SchoolEntity['school_demand_status'] | 'SUSPENDED')[];
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const MENU_ITEMS: (SchoolEntity['school_demand_status'] | 'SUSPENDED')[] = [
    'PROCESSING',
    'PENDING',
    'REJECTED',
    'VALIDATED',
    'SUSPENDED',
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{
        vertical: 'top',
        horizontal: 88,
      }}
      open={isOpen}
      onClose={closeMenu}
    >
      {MENU_ITEMS.sort((a, b) => (a > b ? 1 : -1)).map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => onSelect(item)}
          sx={{
            backgroundColor: selectedStatus.includes(item)
              ? theme.common.blueTransparent
              : '',
          }}
        >
          <Stack direction="row" spacing={0} alignItems={'center'}>
            <Checkbox
              checked={selectedStatus.includes(item)}
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
                color: selectedStatus.includes(item)
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
