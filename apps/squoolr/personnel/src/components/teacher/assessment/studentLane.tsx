import { Chip, TableCell, TableRow } from '@mui/material';
import { IGroupAssignment, StudentAssessmentAnswer } from '@squoolr/interfaces';
import { useIntl } from 'react-intl';

export default function StudentLane({
  position: p,
  onSelect,
  student: { fullname, matricule, submitted_at, total_score },
  total,
}: {
  position: number;
  student: Omit<StudentAssessmentAnswer, 'questionAnswers'>;
  onSelect: () => void;
  total: number;
}) {
  const { formatDate, formatNumber } = useIntl();
  return (
    <TableRow hover onClick={() => onSelect()}>
      <TableCell>{p}</TableCell>
      <TableCell>{matricule}</TableCell>
      <TableCell>{fullname}</TableCell>
      <TableCell>
        <Chip
          label={`${formatNumber(total_score)} / ${total}`}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        {formatDate(new Date(submitted_at), {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}
      </TableCell>
    </TableRow>
  );
}

export function GroupLane({
  position: p,
  onSelect,
  group: { group_code, total_score, number_of_students, is_submitted },
  total,
}: {
  position: number;
  group: IGroupAssignment;
  onSelect: () => void;
  total: number;
}) {
  const { formatNumber, formatMessage } = useIntl();
  return (
    <TableRow hover onClick={() => onSelect()}>
      <TableCell>{p}</TableCell>
      <TableCell>{group_code}</TableCell>
      <TableCell>{formatNumber(number_of_students)}</TableCell>
      <TableCell>
        <Chip
          label={`${formatNumber(total_score)} / ${total}`}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        {formatMessage({ id: is_submitted ? 'submitted' : 'notSubmitted' })}
      </TableCell>
    </TableRow>
  );
}
