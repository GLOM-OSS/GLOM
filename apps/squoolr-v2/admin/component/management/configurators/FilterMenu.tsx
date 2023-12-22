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
  onShowArchives,
  showArchives,
}: {
  closeMenu: () => void;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onShowArchives: () => void;
  showArchives: boolean;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

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
      <MenuItem
        onClick={() => onShowArchives()}
        sx={{
          backgroundColor: showArchives ? theme.common.blueTransparent : '',
        }}
      >
        <Stack direction="row" spacing={0} alignItems={'center'}>
          <Checkbox
            checked={showArchives}
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
              color: showArchives
                ? theme.palette.primary.main
                : theme.common.body,
            }}
          >
            {formatMessage({ id: 'showArchived' })}
          </Typography>
        </Stack>
      </MenuItem>
    </Menu>
  );
}
