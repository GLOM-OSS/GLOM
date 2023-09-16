import { ReportRounded } from '@mui/icons-material';
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
  Typography,
} from '@mui/material';
import {
  anonimateEvaluation,
  getEvaluation,
  getEvaluationHasStudents,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/confirm-dialogs';
import {
  AnonimatedEvaluationHasStudent,
  Evaluation,
} from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import AnonimationStudentLane from '../../components/registry/exams/anonimationStudentLane';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../components/teacher/courseLane';

export default function AnonimationDetails() {
  const { formatMessage } = useIntl();
  const { evaluation_id } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState<Evaluation>();
  const [isEvaluationLoading, setIsEvaluationLoading] =
    useState<boolean>(false);
  const [evaluationNotif, setEvaluationNotif] = useState<useNotification>();

  const [evaluationHasStudents, setEvaluationHasStudents] = useState<
    AnonimatedEvaluationHasStudent[]
  >([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [studentNotif, setStudentNotif] = useState<useNotification>();

  const loadEvaluation = () => {
    setIsEvaluationLoading(true);
    setEvaluationHasStudents([]);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    getEvaluation(evaluation_id as string)
      .then((evaluation) => {
        setEvaluation(evaluation);
        setIsEvaluationLoading(false);
        notif.dismiss();
        setEvaluationNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluation' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluation}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getEvaluationFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const loadStudents = () => {
    if (evaluation) {
      setAreStudentsLoading(true);
      const notif = new useNotification();
      if (studentNotif) {
        studentNotif.dismiss();
      }
      setStudentNotif(notif);
      getEvaluationHasStudents(evaluation.evaluation_id)
        .then((studentMarks) => {
          setEvaluationHasStudents(
            studentMarks as AnonimatedEvaluationHasStudent[]
          );
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
                retryFunction={loadStudents}
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
    }
  };

  useEffect(() => {
    loadEvaluation();
    return () => {
      //TODO: cleanup above axios call
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadStudents();
    return () => {
      //TODO: cleanup above axios call
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluation]);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);

  const [isAnonimating, setIsAnonimating] = useState<boolean>(false);
  const validateExamAnonimation = () => {
    setIsAnonimating(true);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    notif.notify({ render: formatMessage({ id: 'validating' }) });
    anonimateEvaluation(evaluation_id as string)
      .then(() => {
        notif.dismiss();
        setEvaluationNotif(undefined);
        navigate('/registry/marks-management/exams');
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={validateExamAnonimation}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'validatingFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsAnonimating(false));
  };

  return (
    <>
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmDialogOpen(false)}
        confirm={() => alert('hello')}
        dialogMessage="confirmAnonimationFinishMessage"
        isDialogOpen={isConfirmDialogOpen}
        confirmButton="finish"
        dialogTitle="confirmAnonimationFinish"
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          rowGap: theme.spacing(1),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'end',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            {formatMessage({ id: 'evaluationAnonymities' })}
          </Typography>
          {evaluation && (
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'end',
                columnGap: theme.spacing(1),
              }}
            >
              <Chip
                label={formatMessage({
                  id: evaluation.evaluation_sub_type_name,
                })}
                sx={{
                  backgroundColor: lighten(theme.palette.success.main, 0.6),
                }}
              />
              <Chip
                label={formatMessage({ id: evaluation.subject_title })}
                sx={{
                  backgroundColor: lighten(theme.palette.success.main, 0.6),
                }}
              />
            </Box>
          )}
        </Box>
        <Scrollbars autoHide>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                backgroundColor: lighten(theme.palette.primary.light, 0.6),
              }}
            >
              <TableRow>
                {['number', 'matricule', 'fullname', 'anonymity'].map(
                  (val, index) => (
                    <TableCell key={index}>
                      {formatMessage({ id: val })}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isEvaluationLoading || areStudentsLoading ? (
                [...new Array(10)].map((_, index) => (
                  <TableLaneSkeleton cols={4} key={index} />
                ))
              ) : !evaluation ? (
                <NoTableElement
                  message={formatMessage({ id: 'evaluationNotFound' })}
                  colSpan={4}
                />
              ) : evaluationHasStudents.length === 0 ? (
                <NoTableElement
                  message={formatMessage({ id: 'noStudents' })}
                  colSpan={5}
                />
              ) : (
                evaluationHasStudents.map((student, index) => (
                  <AnonimationStudentLane
                    student={student}
                    position={index + 1}
                    key={index}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbars>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none', justifySelf: 'end' }}
          disabled={
            isConfirmDialogOpen ||
            isEvaluationLoading ||
            areStudentsLoading ||
            isAnonimating
          }
          onClick={validateExamAnonimation}
        >
          {formatMessage({ id: 'validateAnonimation' })}
        </Button>
      </Box>
    </>
  );
}
