import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  getStudentAssessmentMarks,
  publishAssessment,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import { Assessment, StudentAssessmentAnswer } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import PublishAssessmentDialog from './publishAssessmentDialog';
import StudentLane from './studentLane';

export default function SubmissionList({
  onBack,
  activeAssessment,
  setActiveStudent,
  openStatistics,
  setActiveAssessment,
}: {
  onBack: () => void;
  activeAssessment: Assessment;
  setActiveStudent: (
    val: Omit<StudentAssessmentAnswer, 'questionAnswers'>
  ) => void;
  openStatistics: () => void;
  setActiveAssessment: (val: Assessment) => void;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [students, setStudents] = useState<
    Omit<StudentAssessmentAnswer, 'questionAnswers'>[]
  >([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [studentNotif, setStudentNotif] = useState<useNotification>();

  const loadStudents = (activeAssessment: Assessment) => {
    setAreStudentsLoading(true);
    const notif = new useNotification();
    if (studentNotif) {
      studentNotif.dismiss();
    }
    setStudentNotif(notif);
    getStudentAssessmentMarks(activeAssessment.assessment_id)
      .then((students) => {
        setStudents(students);
        setAreStudentsLoading(false);
        notif.dismiss();
        setStudentNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudents(activeAssessment)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getStudentsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadStudents(activeAssessment);
    return () => {
      //TODO: CLEANUP AXIOS FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isConfirmPublishDialogOpen, setIsConfirmPublishDialogOpen] =
    useState<boolean>(false);

  const [isPublishingAssessment, setIsPublishingAssessment] =
    useState<boolean>(false);
  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();

  const publishAssessmentHandler = (
    assessment: Assessment,
    annual_evaluation_sub_type_id: string | undefined
  ) => {
    setIsPublishingAssessment(true);
    const notif = new useNotification();
    if (assessmentNotif) assessmentNotif.dismiss();
    setAssessmentNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'publishingAssessment',
      }),
    });
    publishAssessment(
      assessment.assessment_id,
      annual_evaluation_sub_type_id as string
    )
      .then(() => {
        setActiveAssessment({ ...assessment, is_published: true });
        setIsPublishingAssessment(false);
        notif.update({
          render: formatMessage({ id: 'publishedAssessmentSuccessfully' }),
        });
        setAssessmentNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                publishAssessmentHandler(
                  assessment,
                  annual_evaluation_sub_type_id
                )
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'publishAssessmentFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [
    isConfirmPublishWithEvaluationDialogOpen,
    setIsConfirmPublishWithEvaluationDialogOpen,
  ] = useState<boolean>(false);
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setIsConfirmPublishWithEvaluationDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          {formatMessage({ id: 'publishAsEvaluationScores' })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsConfirmPublishDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          {formatMessage({ id: 'publishAssessment' })}
        </MenuItem>
      </Menu>

      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmPublishDialogOpen(false)}
        dialogMessage="confirmPublishMarksDialogMessage"
        isDialogOpen={isConfirmPublishDialogOpen}
        confirmButton="publish"
        dialogTitle="confirmPublishMarks"
        confirm={() => publishAssessmentHandler(activeAssessment, undefined)}
      />
      <PublishAssessmentDialog
        closeDialog={() => setIsConfirmPublishWithEvaluationDialogOpen(false)}
        handleSubmit={(evaluation_has_sub_type_id: string) =>
          publishAssessmentHandler(activeAssessment, evaluation_has_sub_type_id)
        }
        isDialogOpen={isConfirmPublishWithEvaluationDialogOpen}
      />
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
                  label={formatDate(
                    new Date(activeAssessment.assessment_date),
                    {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }
                  )}
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
                      backgroundColor: lighten(
                        theme.palette.primary.main,
                        0.93
                      ),
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
              onClick={openStatistics}
            >
              {formatMessage({ id: 'statistics' })}
            </Button>
            {activeAssessment.is_published ? (
              <Chip
                color="success"
                label={formatMessage({ id: 'published' })}
              />
            ) : (
              <Button
                variant="contained"
                color="inherit"
                sx={{ textTransform: 'none' }}
                disabled={areStudentsLoading || isPublishingAssessment}
                size="small"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                {formatMessage({ id: 'publish' })}
              </Button>
            )}
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
                  <TableCell key={index}>
                    {formatMessage({ id: val })}
                  </TableCell>
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
    </>
  );
}
