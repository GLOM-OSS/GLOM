import { Chip, lighten, Skeleton, TableCell, TableRow } from '@mui/material';
import { Course } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

export function NoTableElement({
  colSpan = 6,
  message,
}: {
  colSpan?: number;
  message: string;
}) {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      <TableCell colSpan={colSpan} align="center" sx={{ textAlign: 'center' }}>
        {message}
      </TableCell>
    </TableRow>
  );
}

export function TableLaneSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      {[...new Array(cols)].map((_, index) => (
        <TableCell component="th" scope="row" key={index}>
          <Skeleton animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function CourseLane({
  course: {
    annual_credit_unit_subject_id: acus_id,
    classroomAcronyms: c_accr,
    subject_code: sc,
    subject_title: st,
    has_course_plan: hcp,
    is_ca_available: has_ca,
    is_exam_available: has_exam,
    is_resit_available: has_resit,
  },
  position: p,
}: {
  course: Course;
  position: number;
}) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  return (
    <TableRow
      onClick={() => navigate(acus_id)}
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
    >
      <TableCell>{p}</TableCell>
      <TableCell>{sc}</TableCell>
      <TableCell>{st}</TableCell>
      <TableCell>{c_accr.join(', ')}</TableCell>
      <TableCell>
        <Chip
          label={formatMessage({ id: hcp ? 'defined' : 'notDefined' })}
          sx={{
            backgroundColor: lighten(
              theme.palette[hcp ? 'success' : 'error'].main,
              0.6
            ),
          }}
        />
      </TableCell>
      <TableCell>
        {has_resit ? (
          <Chip
            label={formatMessage({ id: 'finished' })}
            sx={{
              backgroundColor: lighten(theme.palette['success'].main, 0.6),
            }}
          />
        ) : (
          <Chip
            label={formatMessage({
              id: has_exam
                ? 'pendingResit'
                : has_ca
                ? 'pendingExam'
                : 'pendingCA',
            })}
            sx={{ backgroundColor: lighten(theme.palette['error'].main, 0.6) }}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
