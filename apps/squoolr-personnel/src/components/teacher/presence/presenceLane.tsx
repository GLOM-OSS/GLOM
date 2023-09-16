import { TableCell, TableRow } from '@mui/material';
import { PresenceList } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function PresenceLane({
  presence: {
    subject_code: sc,
    subject_title: st,
    presence_list_date: pld,
    start_time: s_time,
    end_time: e_time,
    chapters: c,
  },
  activateSession,
}: {
  presence: PresenceList;
  activateSession: () => void;
}) {
  const { formatDate, formatTime } = useIntl();

  return (
    <TableRow
      onClick={activateSession}
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
    >
      <TableCell>{sc}</TableCell>
      <TableCell>{st}</TableCell>
      <TableCell>
        {formatDate(pld, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })}
      </TableCell>
      <TableCell>
        {formatTime(s_time, {
          hour: '2-digit',
          minute: '2-digit',
          dayPeriod: 'short',
        })}
      </TableCell>
      <TableCell>
        {formatTime(e_time, {
          hour: '2-digit',
          minute: '2-digit',
          dayPeriod: 'short',
        })}
      </TableCell>
      <TableCell>{c.length < 10 ? `0${c.length}` : c.length}</TableCell>
    </TableRow>
  );
}
