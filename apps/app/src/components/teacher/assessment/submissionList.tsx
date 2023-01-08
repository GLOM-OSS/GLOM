import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    lighten,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Assessment, StudentAssessmentAnswer
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import StudentLane from './studentLane';

export default function SubmissionList({
  onBack,
  activeAssessment,
  setActiveStudent,
}: {
  onBack: () => void;
  activeAssessment: Assessment;
  setActiveStudent: (val: StudentAssessmentAnswer) => void;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [students, setStudents] = useState<StudentAssessmentAnswer[]>([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [studentNotif, setStudentNotif] = useState<useNotification>();

  const loadStudents = (activeAssessment: Assessment) => {
    setAreStudentsLoading(true);
    const notif = new useNotification();
    if (studentNotif) {
      studentNotif.dismiss();
    }
    setStudentNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load assessment students with data activeAssessment
      if (6 > 5) {
        const newStudents: StudentAssessmentAnswer[] = [
          {
            fullname: 'Tchakoumi Lorrain',
            matricule: '17C005',
            questionAnswers: [],
            submitted_at: new Date(),
            total_score: 18,
          },
          {
            fullname: 'Tchami Jennifer',
            matricule: '17C006',
            questionAnswers: [],
            submitted_at: new Date(),
            total_score: 18,
          },
        ];
        setStudents(newStudents);
        setAreStudentsLoading(false);
        notif.dismiss();
        setStudentNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudents(activeAssessment)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getStudentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadStudents(activeAssessment);
    return () => {
      //TODO: CLEANUP AXIOS FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(2),
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          alignItems: 'center',
          justifyItems: 'end',
          columnGap: theme.spacing(2),
        }}
      >
        <Tooltip arrow title={formatMessage({ id: 'back' })}>
          <Button
            onClick={onBack}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<KeyboardBackspaceOutlined />}
          />
        </Tooltip>
        <Typography variant="h6">
          {formatMessage({ id: 'assessmentSubmissions' })}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gridAutoFlow: 'column',
            columnGap: theme.spacing(1),
          }}
        >
          {activeAssessment.assessment_date && (
            <Box
              sx={{
                display: 'grid',
                alignItems: 'center',
                gridAutoFlow: 'column',
                columnGap: theme.spacing(1),
              }}
            >
              <Chip
                sx={{
                  backgroundColor: lighten(theme.palette.primary.main, 0.93),
                }}
                label={formatDate(new Date(activeAssessment.assessment_date), {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              />
              <Chip
                sx={{
                  backgroundColor: lighten(theme.palette.primary.main, 0.93),
                }}
                label={formatNumber(activeAssessment.duration as number, {
                  style: 'unit',
                  unit: 'minute',
                  unitDisplay: 'short',
                })}
              />
              {activeAssessment.evaluation_sub_type_name && (
                <Chip
                  sx={{
                    backgroundColor: lighten(theme.palette.primary.main, 0.93),
                  }}
                  label={formatMessage({
                    id: activeAssessment.evaluation_sub_type_name,
                  })}
                />
              )}
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {formatMessage({ id: 'statistics' })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            size="small"
          >
            {formatMessage({ id: 'publishAsExamScores' })}
          </Button>
        </Box>
      </Box>
      <Scrollbars autoHide>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: lighten(theme.palette.primary.light, 0.6),
            }}
          >
            <TableRow>
              {[
                'number',
                'matricule',
                'studentName',
                'score',
                'submittedAt',
              ].map((val, index) => (
                <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {areStudentsLoading ? (
              [...new Array(10)].map((_, index) => (
                <TableLaneSkeleton cols={5} key={index} />
              ))
            ) : students.length === 0 ? (
              <NoTableElement
                message={formatMessage({ id: 'noSubmissions' })}
                colSpan={5}
              />
            ) : (
              students.map((student, index) => (
                <StudentLane
                  student={student}
                  total={activeAssessment.total_mark}
                  position={index + 1}
                  onSelect={() => setActiveStudent(student)}
                  key={index}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  );
}
