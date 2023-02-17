import { TableCell, TableRow } from '@mui/material';
import { Student } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';

export default function PresenceStudentLane({
  student: { matricule: m, first_name: fn, last_name: ln },
}: {
  student: Student;
}) {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
    >
      <TableCell>{m}</TableCell>
      <TableCell>{`${fn} ${ln}`}</TableCell>
      {/* <TableCell></TableCell> */}
    </TableRow>
  );
}
