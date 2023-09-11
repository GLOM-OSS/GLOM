import { Student } from '@squoolr/interfaces';
import { Chip, lighten, TableCell, TableRow } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export default function StudentLane({
  student: {
    annual_student_id: as_id,
    matricule: m,
    first_name: fn,
    last_name: ln,
    phone_number: pn,
    email: e,
    classroom_acronym: ca,
    is_active,
  },
}: {
  student: Student;
}) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  return (
    <TableRow
      onClick={() => navigate(as_id)}
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
    >
      <TableCell>{m}</TableCell>
      <TableCell>{fn}</TableCell>
      <TableCell>{ln}</TableCell>
      <TableCell>{pn}</TableCell>
      <TableCell>{e}</TableCell>
      <TableCell>
        <Chip
          label={ca}
          size="small"
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.6),
          }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={formatMessage({ id: is_active ? 'active' : 'inactive' })}
          size="small"
          sx={{
            backgroundColor: lighten(
              theme.palette[is_active ? 'success' : 'error'].main,
              0.6
            ),
          }}
        />
      </TableCell>
    </TableRow>
  );
}
