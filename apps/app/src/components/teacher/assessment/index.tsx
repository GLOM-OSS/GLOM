import {
  AddOutlined,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ActivateAssessment,
  Assessment,
  EvaluationSubTypeEnum,
  Question,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import AssessmentLane from './assessmentLane';
import AssessmentList from './assessmentList';
import moment, { Moment } from 'moment';
import ActivateAssessmentDialog from './activateAssessmentDialog';
import QuestionSkeleton from './questionSkeleton';
import QuestionDisplay from './questionDisplay';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';

export default function Assessments() {
  const { formatMessage, formatNumber, formatDate } = useIntl();

  const [activeAssessment, setActiveAssessment] = useState<Assessment>();

  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();
  const [isCreatingAssessment, setIsCreatingAssessment] =
    useState<boolean>(false);

  const createAssessment = () => {
    setIsCreatingAssessment(true);
    const notif = new useNotification();
    if (assessmentNotif) assessmentNotif.dismiss();
    setAssessmentNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingAssessment',
      }),
    });
    setTimeout(() => {
      //TODO: call api here to delete resource
      if (6 > 5) {
        const newAssessment: Assessment = {
          annual_credit_unit_subject_id: 'lsei',
          assessment_date: new Date(),
          assessment_id: 'sei',
          chapter_id: 'sei',
          created_at: new Date(),
          duration: null,
          evaluation_sub_type_name: EvaluationSubTypeEnum.ASSIGNMENT,
          total_mark: 0,
        };
        setActiveAssessment(newAssessment);
        setIsCreatingAssessment(false);
        notif.update({
          render: formatMessage({ id: 'assessmentCreatedSuccessfully' }),
        });
        setAssessmentNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={createAssessment}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'createAssessmentFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

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
  }, [activeAssessment]);

  const [isActivateAssessmentDialogOpen, setIsActivateAssessmentDialogOpen] =
    useState<boolean>(false);

  const [isActivatingAssessment, setIsActivatingAssessment] =
    useState<boolean>(false);

  const activateAssessment = (activateData: {
    duration: number;
    assessment_date: Date;
    assessment_time: Date;
    evaluation_id: string;
  }) => {
    if (activeAssessment) {
      setIsActivatingAssessment(true);
      const notif = new useNotification();
      if (questionNotif) questionNotif.dismiss();
      setAssessmentNotif(notif);
      notif.notify({
        render: formatMessage({
          id: 'activatingAssessment',
        }),
      });
      setTimeout(() => {
        //TODO: call api here to activateAssessment
        if (6 > 5) {
          const examDate = activateData.assessment_date
            .toISOString()
            .split('T');
          const x = activateData.assessment_time.toISOString().split('T');
          examDate[1] = x[1];
          setActiveAssessment({
            ...activeAssessment,
            assessment_date: new Date(examDate.join('T')),
            duration: activateData.duration,
          });
          setIsActivatingAssessment(false);
          notif.update({
            render: formatMessage({ id: 'assessmentActivatedSuccessfully' }),
          });
          setAssessmentNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => activateAssessment(activateData)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'activatingAssessmentFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [
    isConfirmDeleteQuestionDialogOpen,
    setIsConfirmDeleteQuestionDialogOpen,
  ] = useState<boolean>(false);

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

  return (
    <>
      <ActivateAssessmentDialog
        closeDialog={() => setIsActivateAssessmentDialogOpen(false)}
        isDialogOpen={isActivateAssessmentDialogOpen}
        handleSubmit={(val: ActivateAssessment) => {
          if (activeAssessment) {
            activateAssessment({
              ...val,
              evaluation_id: activeAssessment.assessment_id,
            });
          }
        }}
      />
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
      {!activeAssessment ? (
        <AssessmentList
          createAssessment={createAssessment}
          isCreatingAssessment={isCreatingAssessment}
          setActiveAssessment={setActiveAssessment}
        />
      ) : (
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
                      backgroundColor: lighten(
                        theme.palette.primary.main,
                        0.93
                      ),
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
                  areQuestionsLoading ||
                  isCreatingQuestion ||
                  isDeletingQuestion
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
      )}
    </>
  );
}
