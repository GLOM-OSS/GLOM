import { Chip, TableCell, TableRow } from '@mui/material';
import { StudentAssessmentAnswer } from '@squoolr/interfaces';
import { useIntl } from 'react-intl';

export default function StudentLane({
  position: p,
  onSelect,
  student: { fullname, matricule, submitted_at, total_score },
  total
}: {
  position: number;
  student: StudentAssessmentAnswer;
  onSelect: () => void;
  total:number
}) {
  const { formatDate, formatNumber } = useIntl();
  return (
    <TableRow hover onClick={() => onSelect()}>
      <TableCell>{p}</TableCell>
      <TableCell>{matricule}</TableCell>
      <TableCell>{fullname}</TableCell>
      <TableCell>
        <Chip label={`${formatNumber(total_score)} / ${total}`} variant="outlined" />
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
