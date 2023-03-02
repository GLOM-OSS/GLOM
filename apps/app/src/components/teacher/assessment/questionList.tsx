import {
  AddRounded,
  InsertDriveFileOutlined,
  KeyboardBackspaceOutlined,
  ReportRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Fab,
  lighten,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  createNewQuestion,
  deleteQuestion,
  getAssessmentQuestions,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import { Assessment, CreateQuestion, Question } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import QuestionDialog from './questionDialog';
import QuestionDisplay from './questionDisplay';
import QuestionSkeleton from './questionSkeleton';

export default function QuestionList({
  activeAssessment,
  activeAssessment: { is_assignment: isAssignment },
  setActiveAssessment,
  setIsActivateAssessmentDialogOpen,
  isActivatingAssessment,
  onShowResponses,
  confirmPublishAssignment,
}: {
  setActiveAssessment: (val: Assessment | undefined) => void;
  activeAssessment: Assessment;
  setIsActivateAssessmentDialogOpen: (val: boolean) => void;
  isActivatingAssessment: boolean;
  onShowResponses: () => void;
  confirmPublishAssignment?: () => void;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setAreQuestionsLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const loadQuestions = (assessment_id: string) => {
    setAreQuestionsLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
    getAssessmentQuestions(assessment_id)
      .then((questions) => {
        setQuestions(questions);
        setAreQuestionsLoading(false);
        notif.dismiss();
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingQuestions' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadQuestions(assessment_id)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getQuestionsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (activeAssessment) loadQuestions(activeAssessment.assessment_id);
    return () => {
      //TODO: cleanup above axios fetch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAssessment]);

  const [isDeletingQuestion, setIsDeletingQuestion] = useState<boolean>(false);

  const deleteQuestionHandler = (question: Question) => {
    setIsDeletingQuestion(true);
    const notif = new useNotification();
    if (questionNotif) questionNotif.dismiss();
    setQuestionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'deletingQuestion',
      }),
    });
    deleteQuestion(question.question_id)
      .then(() => {
        setQuestions(
          questions.filter(
            ({ question_id: q_id }) => q_id !== question.question_id
          )
        );
        notif.update({
          render: formatMessage({ id: 'questionDeletedSuccessfully' }),
        });
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteQuestionHandler(question)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'deleteQuestionFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsDeletingQuestion(false));
  };

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] =
    useState<boolean>(false);

  const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [
    isConfirmDeleteQuestionDialogOpen,
    setIsConfirmDeleteQuestionDialogOpen,
  ] = useState<boolean>(false);

  const createQuestion = (
    question: CreateQuestion,
    resources: {
      id: string;
      file: File;
    }[],
    answerFile?: File
  ) => {
    setIsCreatingQuestion(true);
    const notif = new useNotification();
    if (questionNotif) questionNotif.dismiss();
    setQuestionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingQuestion',
      }),
    });
    createNewQuestion(
      question,
      resources.map((_) => _.file),
      answerFile
    )
      .then((newQuestion) => {
        setQuestions([
          {
            ...newQuestion,
            questionOptions: (question.questionOptions ?? []).map(
              ({ is_answer, option }, index) => {
                return {
                  question_id: newQuestion.question_id,
                  question_option_id: `wie${index}`,
                  is_answer,
                  option,
                };
              }
            ),
            questionResources: newQuestion?.questionResources ?? [],
          },
          ...questions,
        ]);
        setActiveAssessment({
          ...activeAssessment,
          total_mark: activeAssessment.total_mark + newQuestion.question_mark,
        });
        notif.update({
          render: formatMessage({ id: 'questionCreatedSuccessfully' }),
        });
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createQuestion(question, resources)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'createQuestionFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsCreatingQuestion(false));
  };

  return (
    <>
      {activeQuestion && (
        <ConfirmDeleteDialog
          closeDialog={() => setIsConfirmDeleteQuestionDialogOpen(false)}
          dialogMessage={'confirmDeleteQuestionDialogMessage'}
          isDialogOpen={isConfirmDeleteQuestionDialogOpen}
          confirmButton="delete"
          dialogTitle="deleteQuestion"
          confirm={() => deleteQuestionHandler(activeQuestion)}
        />
      )}

      <QuestionDialog
        assessment_id={activeAssessment.assessment_id}
        closeDialog={() => setIsQuestionDialogOpen(false)}
        isDialogOpen={isQuestionDialogOpen}
        onSubmit={createQuestion}
        isAssignment={isAssignment}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(1),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(2),
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
              <Fab
                color="primary"
                size="small"
                onClick={() => setActiveAssessment(undefined)}
              >
                <KeyboardBackspaceOutlined fontSize="small" />
              </Fab>
            </Tooltip>
            {activeAssessment.assessment_date ? (
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
                {isAssignment && (
                  <Chip
                    sx={{
                      backgroundColor: lighten(
                        theme.palette.primary.main,
                        0.93
                      ),
                    }}
                    label={`${formatMessage({
                      id: activeAssessment.submission_type,
                    })} ${
                      activeAssessment.submission_type === 'Group'
                        ? '(' +
                          formatNumber(activeAssessment.number_per_group ?? 1) +
                          ' ' +
                          formatMessage({ id: 'perGroup' }) +
                          ')'
                        : ''
                    }`}
                  />
                )}
                {!isAssignment && (
                  <Chip
                    sx={{
                      backgroundColor: lighten(
                        theme.palette.primary.main,
                        0.93
                      ),
                    }}
                    label={formatNumber(activeAssessment.duration as number, {
                      style: 'unit',
                      unit: 'minute',
                      unitDisplay: 'short',
                    })}
                  />
                )}
                {activeAssessment.evaluation_sub_type_name && !isAssignment && (
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
            ) : questions.length > 0 ? (
              <Button
                onClick={() =>
                  isAssignment && confirmPublishAssignment
                    ? confirmPublishAssignment()
                    : setIsActivateAssessmentDialogOpen(true)
                }
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
                size="small"
                disabled={
                  isActivatingAssessment ||
                  areQuestionsLoading ||
                  isCreatingQuestion
                }
              >
                {formatMessage({
                  id: isAssignment
                    ? 'activateAssignment'
                    : 'activateAssessment',
                })}
              </Button>
            ) : (
              <Typography></Typography>
            )}
            <Box
              sx={{
                display: 'grid',
                alignItems: 'center',
                gridAutoFlow: 'column',
                columnGap: theme.spacing(1),
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  alignItems: 'center',
                  gridAutoFlow: 'column',
                  columnGap: theme.spacing(1),
                }}
              >
                <Typography>{formatMessage({ id: 'totalMarks' })}</Typography>
                <Chip
                  color="success"
                  sx={{ color: theme.common.offWhite }}
                  label={activeAssessment.total_mark ?? 0}
                />
              </Box>
              {activeAssessment.assessment_date &&
                (new Date(
                  moment(activeAssessment.assessment_date)
                    .add(activeAssessment.duration, 'minutes')
                    .toLocaleString()
                ) < new Date() ||
                  isAssignment) && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    size="small"
                    disabled={areQuestionsLoading}
                    onClick={onShowResponses}
                    startIcon={<InsertDriveFileOutlined />}
                  >
                    {formatMessage({ id: 'viewResponses' })}
                  </Button>
                )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%', position: 'relative' }}>
          {!activeAssessment.assessment_date && (
            <Tooltip arrow title={formatMessage({ id: `newQuestion` })}>
              <Fab
                disabled={
                  areQuestionsLoading ||
                  isCreatingQuestion ||
                  isDeletingQuestion
                }
                onClick={() => setIsQuestionDialogOpen(true)}
                color="primary"
                sx={{ position: 'absolute', bottom: 16, right: 24 }}
              >
                <AddRounded />
              </Fab>
            </Tooltip>
          )}
          <Scrollbars autoHide>
            {areQuestionsLoading ? (
              [...new Array(10)].map((_, index) => (
                <QuestionSkeleton key={index} />
              ))
            ) : questions.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {formatMessage({ id: 'noQuestionsYet' })}
              </Typography>
            ) : (
              questions.map((question, index) => (
                <QuestionDisplay
                  disabled={isCreatingQuestion || isDeletingQuestion}
                  question={question}
                  isActivated={activeAssessment.assessment_date ? true : false}
                  position={index + 1}
                  //   onEdit={() => setEditableQuestion(question)}
                  onDelete={() => {
                    setActiveQuestion(question);
                    setIsConfirmDeleteQuestionDialogOpen(true);
                  }}
                  key={index}
                />
              ))
            )}
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
