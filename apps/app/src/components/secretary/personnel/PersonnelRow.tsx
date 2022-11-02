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
  personnel_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  login_id: string;
  last_connected: Date;
  is_academic_service: boolean;
  is_coordo: boolean;
  is_secretariat: boolean;
  is_teacher: boolean;
  is_archived: boolean;
  national_id_number?: string;
  address?: string;
  birthdate?: Date;
  gender?: 'M' | 'F';
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
    first_name,
    last_name,
    email,
    phone_number,
    last_connected,
    is_academic_service,
    is_coordo,
    is_secretariat,
    is_teacher,
    is_archived,
  },
  personnel,
  index,
  openEditDialog,
  openProfileDialog,
  openResetPasswordDialog,
  openResetCodeDialog,
  isSubmitting,
  isActive,
}: {
  isSubmitting: boolean;
  personnel: PersonnelInterface;
  index: number;
  isActive: boolean;
  openEditDialog: (personnel: PersonnelInterface) => void;
  openProfileDialog: (personnel: PersonnelInterface) => void;
  openResetPasswordDialog: (personnel: PersonnelInterface) => void;
  openResetCodeDialog: (personnel: PersonnelInterface) => void;
}) {
  const { formatMessage, formatTime } = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        menuItems={
          is_archived
            ? [
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel),
                },
              ]
            : is_secretariat && !(is_academic_service || is_teacher)
            ? [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel),
                },
              ]
            : is_secretariat && (is_academic_service || is_teacher)
            ? [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel),
                },
                {
                  menu_title: 'resetPrivateCode2',
                  executeFunction: () => openResetCodeDialog(personnel),
                },
              ]
            : [
                {
                  menu_title: 'edit',
                  executeFunction: () => openEditDialog(personnel),
                },
                {
                  menu_title: 'seeProfile',
                  executeFunction: () => openProfileDialog(personnel),
                },
                {
                  menu_title: 'resetPassword2',
                  executeFunction: () => openResetPasswordDialog(personnel),
                },
                {
                  menu_title: 'resetPrivateCode2',
                  executeFunction: () => openResetCodeDialog(personnel),
                },
              ]
        }
      />
      <TableRow
        sx={{
          backgroundColor: isActive
            ? lighten(theme.palette.secondary.main, 0.8)
            : is_archived
            ? lighten(theme.palette.error.main, 0.9)
            : index % 2 === 1
            ? lighten(theme.palette.primary.main, 0.96)
            : 'none',
        }}
      >
        <TableCell component="th" scope="row">
          {`${first_name} ${last_name}`}
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{phone_number}</TableCell>
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
            disabled={isSubmitting}
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
