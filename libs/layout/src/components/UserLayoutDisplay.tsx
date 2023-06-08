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
import { useUser } from '../contexts/UserContextProvider';
import { UserRole } from '@squoolr/interfaces';

export default function UserLayoutDisplay({
  selectRole,
  activeRole,
  userRoles,
}: {
  selectRole: (item: UserRole) => void;
  activeRole?: UserRole;
  userRoles: UserRole[];
}) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { first_name, image_ref } = useUser();

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
          {first_name}
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
              {formatMessage({ id: activeRole || 'loading' })}
            </Typography>
            {userRoles &&
              userRoles.length > 0 &&
              activeRole !== 'administrator' && (
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
