import { StaffRole } from '@glom/data-types';
import { useTheme } from '@glom/theme';
import { Box, Chip, lighten } from '@mui/material';
import { useIntl } from 'react-intl';

export default function StaffRoles({ roles }: { roles: StaffRole[] }) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const ROLE_COLOR: Record<
    StaffRole,
    'warning' | 'success' | 'secondary' | 'primary'
  > = {
    CONFIGURATOR: 'warning',
    COORDINATOR: 'success',
    REGISTRY: 'secondary',
    TEACHER: 'primary',
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 0.5,
      }}
    >
      {roles
        .sort((a, b) => (a > b ? 1 : -1))
        .map((role, index) => (
          <Chip
            key={index}
            color={ROLE_COLOR[role]}
            size="small"
            variant="outlined"
            label={formatMessage({
              id: role.toLowerCase(),
            })}
            sx={{
              color: theme.common.titleActive,
              fontWeight: '600',
              backgroundColor: lighten(
                theme.palette[ROLE_COLOR[role]].main,
                0.9
              ),
            }}
          />
        ))}
    </Box>
  );
}
