import { TableCell, TableRow } from '@mui/material';
import { AnonimatedEvaluationHasStudent } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';

export default function AnonimationStudentLane({
  student: { anonymity_code: ac, fullname: fn, matricule: m },
  position: p,
}: {
  student: AnonimatedEvaluationHasStudent;
  position: number;
}) {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
    >
      <TableCell>{p}</TableCell>
      <TableCell>{m}</TableCell>
      <TableCell>{fn}</TableCell>
      <TableCell>{ac}</TableCell>
    </TableRow>
  );
}
