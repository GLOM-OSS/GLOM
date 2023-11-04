import { TableCell, TableRow } from '@mui/material';
import { useIntl } from 'react-intl';

export function NoTableElement({ rowSpan = 5 }: { rowSpan?: number }) {
  const { formatMessage } = useIntl();
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell colSpan={rowSpan} align="center">
        {formatMessage({ id: 'nothingToDisplay' })}
      </TableCell>
    </TableRow>
  );
}
