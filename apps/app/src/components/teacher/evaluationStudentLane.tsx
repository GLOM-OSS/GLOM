import { lighten, TableCell, TableRow, TextField } from '@mui/material';
import { EvaluationHasStudent } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export function EvaluationStudentLane({
  student: {
    evaluation_has_student_id: ehs_id,
    fullname: fn,
    last_updated: lu,
    mark: m,
    matricule: mat,
  },
  student,
  position: p,
  changeMark,
  disabled,
  is_evaluation_published: iep,
  updatedMarks,
}: {
  student: EvaluationHasStudent;
  position: number;
  disabled: boolean;
  is_evaluation_published: boolean;
  updatedMarks: EvaluationHasStudent[];
  changeMark: (
    newMark: number,
    actionnedEvaluationStudent: EvaluationHasStudent
  ) => void;
}) {
  const { formatDate } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        backgroundColor: updatedMarks.find(
          ({ evaluation_has_student_id: ehs_id2 }) => ehs_id === ehs_id2
        )
          ? lighten(theme.palette.secondary.main, 0.93)
          : null,
        cursor: 'pointer',
      }}
      hover={
        !updatedMarks.find(
          ({ evaluation_has_student_id: ehs_id2 }) => ehs_id === ehs_id2
        )
      }
    >
      <TableCell>{p}</TableCell>
      <TableCell>{mat}</TableCell>
      <TableCell>{fn}</TableCell>
      <TableCell>
        {iep ? (
          m
        ) : (
          <TextField
            type="number"
            size="small"
            value={m}
            disabled={disabled}
            onChange={(event) => {
              const newMark = Number(event.target.value);
              if (newMark > 20) alert('markCannotBeGreatedThan20');
              else changeMark(newMark, student);
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {lu?formatDate(new Date(lu), {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }):null}
      </TableCell>
    </TableRow>
  );
}
