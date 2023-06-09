import { TableCell, TableRow, Typography } from '@mui/material';
import { IDiscipline } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function AbsenceLane({
  absence: { absences: abs, presence_list_date: pld, subject_title: st },
}: {
  absence: IDiscipline;
}) {
  const { formatDate, formatNumber } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
    >
      <TableCell>
        {formatDate(pld, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })}
      </TableCell>
      <TableCell>{st}</TableCell>
      <TableCell>
        <Typography color={theme.palette.error.main}>
          {formatNumber(abs, {
            style: 'unit',
            unit: 'hour',
            unitDisplay: 'short',
          })}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
