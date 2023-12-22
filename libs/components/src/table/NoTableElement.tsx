import { TableCell, TableRow } from '@mui/material';
import { useIntl } from 'react-intl';

export function NoTableElement({ cols = 5 }: { cols?: number }) {
  const { formatMessage } = useIntl();
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell colSpan={cols} align="center">
        {formatMessage({ id: 'nothingToDisplay' })}
      </TableCell>
    </TableRow>
  );
}
