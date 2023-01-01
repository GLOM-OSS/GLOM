import { Chip, lighten, TableCell, TableRow } from '@mui/material';
import { Evaluation } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export default function EvaluationLane({
  evaluation: {
    evaluation_id: e_id,
    examination_date: ed,
    is_anonimated: ia,
    subject_title: st,
    evaluation_sub_type_name: est_name,
  },
  position: p,
}: {
  evaluation: Evaluation;
  position: number;
}) {
  const { formatMessage, formatDate } = useIntl();
  const navigate = useNavigate();
  return (
    <TableRow
      onClick={() => (ia ? null : navigate(e_id))}
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover={!ia}
    >
      <TableCell>{p}</TableCell>
      <TableCell>{st}</TableCell>
      <TableCell>{formatMessage({ id: est_name })}</TableCell>
      <TableCell>
        {ed
          ? formatDate(new Date(ed), {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          : null}
      </TableCell>
      <TableCell>
        {
          <Chip
            label={formatMessage({ id: ia ? 'done' : 'pending' })}
            sx={{
              backgroundColor: lighten(
                theme.palette[ia ? 'success' : 'error'].main,
                0.6
              ),
            }}
          />
        }
      </TableCell>
    </TableRow>
  );
}
