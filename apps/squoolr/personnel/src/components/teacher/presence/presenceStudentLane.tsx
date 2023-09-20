import { Checkbox, TableCell, TableRow } from '@mui/material';
import { Student } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';

export default function PresenceStudentLane({
  student: { matricule: m, first_name: fn, last_name: ln },
  onSelect,
  isSelected,
  is_published: ip,
}: {
  student: Student;
  isSelected: boolean;
  onSelect: () => void;
  is_published: boolean;
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
      {!ip && (
        <TableCell align="right">
          <Checkbox onChange={onSelect} checked={isSelected} />
        </TableCell>
      )}
    </TableRow>
  );
}
