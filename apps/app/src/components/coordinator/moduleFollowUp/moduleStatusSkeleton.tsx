import {
  Box, Skeleton,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useIntl } from 'react-intl';

export default function ModuleStatusSkeleton() {
  return (
    <Box>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
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
