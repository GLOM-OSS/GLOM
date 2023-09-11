import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';
import { TableCell, TableRow, Tooltip } from '@mui/material';
import { Course } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ModuleDisplaySubjectLane({
  subject: {
    is_ca_available: ca,
    is_exam_available: exam,
    is_resit_available: resit,
    subject_code: sc,
    subject_title: st,
  },
  position: p,
}: {
  subject: Omit<Course, 'classroomAcronyms' | 'has_course_plan'>;
  position: number;
}) {
  const { formatMessage } = useIntl();
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
      <TableCell>{sc}</TableCell>
      <TableCell>{st}</TableCell>
      <TableCell align="center">
        <Tooltip
          arrow
          title={formatMessage({
            id: ca ? 'marksAvailable' : 'marksUnavailable',
          })}
        >
          {ca ? (
            <CheckCircleOutline color="success" />
          ) : (
            <CancelOutlined color="error" />
          )}
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Tooltip
          arrow
          title={formatMessage({
            id: exam ? 'marksAvailable' : 'marksUnavailable',
          })}
        >
          {exam ? (
            <CheckCircleOutline color="success" />
          ) : (
            <CancelOutlined color="error" />
          )}
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Tooltip
          arrow
          title={formatMessage({
            id: resit ? 'marksAvailable' : 'marksUnavailable',
          })}
        >
          {resit ? (
            <CheckCircleOutline color="success" />
          ) : (
            <CancelOutlined color="error" />
          )}
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
