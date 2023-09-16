import { TableCell, TableRow } from '@mui/material';
import { Course } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export default function CourseLane({
  course: {
    semester: s,
    subject_title: st,
    subject_code: sc,
    annual_credit_unit_subject_id: acus_id,
  },
}: {
  course: Course;
}) {
  const { formatNumber } = useIntl();
  const navigate = useNavigate();

  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
      onClick={() => navigate(acus_id)}
    >
      <TableCell>{st}</TableCell>
      <TableCell>{sc}</TableCell>
      <TableCell align="right">{formatNumber(s as number)}</TableCell>
    </TableRow>
  );
}
