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
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import { Assessment, Question } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import QuestionDisplay from './questionDisplay';
import QuestionSkeleton from './questionSkeleton';

export default function QuestionList({
  activeAssessment,
  setActiveAssessment,
  setIsActivateAssessmentDialogOpen,
  isActivatingAssessment,
}: {
  setActiveAssessment: (val: Assessment | undefined) => void;
  activeAssessment: Assessment;
  setIsActivateAssessmentDialogOpen: (val: boolean) => void;
  isActivatingAssessment: boolean;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setAreQuestionsLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const loadQuestions = () => {
    setAreQuestionsLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load assessments
      if (6 > 5) {
        const newQuestions: Question[] = [
          {
            assessment_id: 'sie',
            question: 'What is the name of the biggest city in the world?',
            question_id: 'wiso',
            question_mark: 2,
            questionOptions: [
              {
                is_answer: true,
                option: 'Nkambe',
                question_id: 'wiso',
                question_option_id: 'oie',
              },
              {
                is_answer: false,
                option: 'Binju',
                question_id: 'wiso',
                question_option_id: 'siue',
              },
              {
                is_answer: false,
                option: 'Binshua',
                question_id: 'wiso',
                question_option_id: 'oies',
              },
              {
                is_answer: false,
                option: 'Binka',
                question_id: 'wiso',
                question_option_id: 'oiwe',
              },
            ],
            questionResources: [
              {
                caption: 2,
                question_id: 'wiso',
                question_resource_id: 'wieos',
                resource_ref:
                  'https://www.kicksonfire.com/wp-content/uploads/2022/11/reebok-kamikaze-ii-seattle-sonics-6-1.jpeg',
              },
              {
                caption: 2,
                question_id: 'wiso',
                question_resource_id: 'wieos',
                resource_ref:
                  'https://www.kicksonfire.com/wp-content/uploads/2022/11/reebok-kamikaze-ii-seattle-sonics-6-1.jpeg',
              },
            ],
          },
        ];
        setQuestions(newQuestions);
        setAreQuestionsLoading(false);
        notif.dismiss();
        setQuestionNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingQuestions' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadQuestions}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getQuestionsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (activeAssessment) {
      loadQuestions();
    }
    return () => {
      //TODO: cleanup above axios fetch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDeletingQuestion, setIsDeletingQuestion] = useState<boolean>(false);

  const deleteQuestion = (question: Question) => {
    setIsDeletingQuestion(true);
    const notif = new useNotification();
    if (questionNotif) questionNotif.dismiss();
    setQuestionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'deletingQuestion',
      }),
    });
    setTimeout(() => {
      //TODO: call api here to delete question
      if (6 > 5) {
        setQuestions(
          questions.filter(
            ({ question_id: q_id }) => q_id !== question.question_id
          )
        );
        setIsDeletingQuestion(false);
        notif.update({
          render: formatMessage({ id: 'questionDeletedSuccessfully' }),
        });
        setQuestionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteQuestion(question)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'deleteQuestionFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isQuestionDialogOpen, setIsQuestionDialog] = useState<boolean>(false);

  const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [
    isConfirmDeleteQuestionDialogOpen,
    setIsConfirmDeleteQuestionDialogOpen,
  ] = useState<boolean>(false);

  return (
    <>
      {activeQuestion && (
        <ConfirmDeleteDialog
          closeDialog={() => setIsConfirmDeleteQuestionDialogOpen(false)}
          dialogMessage={'confirmDeleteQuestionDialogMessage'}
          isDialogOpen={isConfirmDeleteQuestionDialogOpen}
          confirmButton="delete"
          dialogTitle="deleteQuestion"
          confirm={() => deleteQuestion(activeQuestion)}
        />
      )}

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
              <Button
                onClick={() => setActiveAssessment(undefined)}
                variant="contained"
                color="primary"
                size="small"
                startIcon={<KeyboardBackspaceOutlined />}
              />
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
            ) : questions.length > 0 ? (
              <Button
                onClick={() => setIsActivateAssessmentDialogOpen(true)}
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
                {formatMessage({ id: 'activateAssessment' })}
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
                  label={activeAssessment.total_mark}
                />
              </Box>
              {activeAssessment.assessment_date &&
                new Date(
                  moment(activeAssessment.assessment_date)
                    .add(activeAssessment.duration, 'minutes')
                    .toLocaleString()
                ) < new Date() && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    size="small"
                    disabled={areQuestionsLoading}
                    startIcon={<InsertDriveFileOutlined />}
                  >
                    {formatMessage({ id: 'viewResponses' })}
                  </Button>
                )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%', position: 'relative' }}>
          <Tooltip arrow title={formatMessage({ id: `newSubject` })}>
            <Fab
              disabled={
                areQuestionsLoading || isCreatingQuestion || isDeletingQuestion
              }
              onClick={() => setIsQuestionDialog(true)}
              color="primary"
              sx={{ position: 'absolute', bottom: 16, right: 24 }}
            >
              <AddRounded />
            </Fab>
          </Tooltip>
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
