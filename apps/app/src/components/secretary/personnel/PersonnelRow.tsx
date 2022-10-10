import { MoreHorizRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  lighten,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export interface PersonnelInterface {
  personnel_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  last_connected: Date;
  is_academic_service: boolean;
  is_coordo: boolean;
  is_secretariat: boolean;
  is_teacher: boolean;
}

interface MenuItem {
  menu_title: string;
  executeFunction: () => void;
}

const RowMenu = ({
  anchorEl,
  closeMenu,
  menuItems,
}: {
  anchorEl: null | HTMLElement;
  closeMenu: () => void;
  menuItems: MenuItem[];
}) => {
  const { formatMessage } = useIntl();
  return (
    <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={closeMenu}>
      {menuItems.map(({ menu_title, executeFunction }, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            executeFunction();
            closeMenu();
          }}
          sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
        >
          {formatMessage({ id: menu_title })}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default function PersonnelRow({
  personnel: {
    personnel_id,
    first_name,
    last_name,
    email,
    phone,
    last_connected,
    is_academic_service,
    is_coordo,
    is_secretariat,
    is_teacher,
  },
  index,
  openEditDialog,
  openProfileDialog,
  openResetPasswordDialog,
  openResetCodeDialog,
}: {
  personnel: PersonnelInterface;
  index: number;
  openEditDialog: (personnel_id: string) => void;
  openProfileDialog: (personnel_id: string) => void;
  openResetPasswordDialog: (personnel_id: string) => void;
  openResetCodeDialog: (personnel_id: string) => void;
}) {
  const { formatMessage, formatTime } = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        menuItems={
          is_secretariat && !(is_academic_service || is_teacher)
            ? [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel_id),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel_id),
                },
              ]
            : is_secretariat && (is_academic_service || is_teacher)
            ? [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel_id),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel_id),
                },
                {
                  menu_title: 'resetPrivateCode',
                  executeFunction: () => openResetCodeDialog(personnel_id),
                },
              ]
            : [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel_id),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel_id),
                },
                {
                  menu_title: 'resetPassword',
                  executeFunction: () => openResetPasswordDialog(personnel_id),
                },
                {
                  menu_title: 'resetPrivateCode',
                  executeFunction: () => openResetCodeDialog(personnel_id),
                },
              ]
        }
      />
      <TableRow
        sx={{
          backgroundColor:
            index % 2 === 1
              ? lighten(theme.palette.primary.main, 0.96)
              : 'none',
        }}
      >
        <TableCell component="th" scope="row">
          {`${first_name} ${last_name}`}
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{phone}</TableCell>
        <TableCell>{` ${formatTime(last_connected, {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          dayPeriod: 'short',
        })}`}</TableCell>
        <TableCell>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gap: theme.spacing(0.5),
              width: 'fit-content',
            }}
          >
            {is_academic_service && (
              <Chip
                size="small"
                sx={{
                  backgroundColor: lighten(theme.palette.primary.main, 0.8),
                }}
                label={formatMessage({ id: 'sa' })}
              />
            )}
            {is_coordo && (
              <Chip
                size="small"
                sx={{
                  backgroundColor: lighten(theme.palette.error.main, 0.8),
                }}
                label={formatMessage({ id: 'coordo' })}
              />
            )}
            {is_secretariat && (
              <Chip
                size="small"
                sx={{
                  backgroundColor: lighten(theme.palette.secondary.main, 0.8),
                }}
                label={formatMessage({ id: 'sec' })}
              />
            )}
            {is_teacher && (
              <Chip
                size="small"
                sx={{
                  backgroundColor: lighten(theme.palette.primary.main, 0.8),
                }}
                label={formatMessage({ id: 'tea' })}
              />
            )}
          </Box>
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <Tooltip arrow title={formatMessage({ id: 'more' })}>
              <MoreHorizRounded sx={{ fontSize: '24px' }} />
            </Tooltip>
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
