import { KeyboardArrowDownRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { PersonnelRole, User } from '../lib/interfaces';

export default function UserLayoutDisplay({
  user: { fisrt_name, image_ref },
  selectRole,
  activeRole,
  userRoles,
}: {
  user: User;
  selectRole: (item: PersonnelRole) => void;
  activeRole?: PersonnelRole | 'administrator';
  userRoles?: PersonnelRole[];
}) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: theme.spacing(1),
        marginBottom: theme.spacing(5),
        alignItems: 'center',
      }}
    >
      <Avatar src={image_ref} alt="user profile" />
      <Box sx={{ display: 'grid', alignContent: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {fisrt_name}
        </Typography>
        <>
          <Box
            sx={{
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: 'auto 1fr',
              columnGap: theme.spacing(0.8),
              cursor: 'pointer',
            }}
            onClick={(event) =>
              userRoles && userRoles.length > 1 ? handleClick(event) : null
            }
          >
            <Typography variant="caption">
              {formatMessage({ id: activeRole })}
            </Typography>
            {userRoles && userRoles.length > 0 && (
              <Tooltip arrow title={formatMessage({ id: 'listRoles' })}>
                <KeyboardArrowDownRounded
                  sx={{ color: theme.common.label, fontSize: 15 }}
                />
              </Tooltip>
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableAutoFocus
          >
            {userRoles &&
              userRoles
                .sort((a, b) => (a > b ? 1 : -1))
                .map((item, index) => (
                  <MenuItem
                    key={index}
                    sx={{ ...theme.typography.caption }}
                    onClick={() => {
                      selectRole(item);
                      handleClose();
                    }}
                  >
                    {formatMessage({ id: item })}
                  </MenuItem>
                ))}
          </Menu>
        </>
      </Box>
    </Box>
  );
}
