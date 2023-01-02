import {
    Box,
    lighten,
    Skeleton,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ModuleStatusSkeleton() {
  return (
    <Box>
      <Table sx={{ minWidth: 650 }}>
        <TableHead
          sx={{
            backgroundColor: lighten(theme.palette.primary.light, 0.6),
          }}
        >
          <TableRow>
            {[...new Array(6)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
    </Box>
  );
}

export function NoModuleStatus() {
  const { formatMessage } = useIntl();
  return (
    <Typography>
      {formatMessage({ id: 'noModuleStatus' })}
      {/* No modules configured. configure your modules in config section */}
    </Typography>
  );
}
