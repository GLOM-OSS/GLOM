import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
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
  Assessment,
  IQuestionStudentResponse,
  Question,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import ConfirmSubmitAssessmentDialog from './confirmSubmitAssessmentDialog';
import { useCountdown } from './countdownHook';
import QuestionDisplay from './questionDisplay';
import QuestionSkeleton from './questionSkeleton';

export default function QuestionList({
  activeAssessment,
  activeAssessment: { is_assignment: isAssignment },
  setActiveAssessment,
}: {
  setActiveAssessment: (val: Assessment | undefined) => void;
  activeAssessment: Assessment;
}) {
  const { formatMessage } = useIntl();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setAreQuestionsLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  // const loadQuestions = (assessment_id: string) => {
  //   setAreQuestionsLoading(true);
  //   const notif = new useNotification();
  //   if (questionNotif) {
  //     questionNotif.dismiss();
  //   }
  //   setQuestionNotif(notif);
  //   getAssessmentQuestions(assessment_id)
  //     .then((questions) => {
  //       setQuestions(questions);
  //       setAreQuestionsLoading(false);
  //       notif.dismiss();
  //       setQuestionNotif(undefined);
  //     })
  //     .catch((error) => {
  //       notif.notify({
  //         render: formatMessage({ id: 'loadingQuestions' }),
  //       });
  //       notif.update({
  //         type: 'ERROR',
  //         render: (
  //           <ErrorMessage
  //             retryFunction={() => loadQuestions(assessment_id)}
  //             notification={notif}
  //             message={
  //               error?.message || formatMessage({ id: 'getQuestionsFailed' })
  //             }
  //           />
  //         ),
  //         autoClose: false,
  //         icon: () => <ReportRounded fontSize="medium" color="error" />,
  //       });
  //     });
  // };

  function loadQuestions(assessment_id: string) {
    //TODO: CALL API TO LOAD QUESTIONS
    const questions: Question[] = [
      {
        assessment_id: 'wiw',
        question: 'What is your full name',
        question_answer: '',
        question_id: 'owie',
        question_mark: 2,
        question_type: 'MCQ',
        questionResources: [],
        questionOptions: [
          {
            is_answer: false,
            option: 'hello',
            question_id: 'oswie',
            question_option_id: 'ei',
          },
          {
            is_answer: true,
            option: 'hello workd',
            question_id: 'owie',
            question_option_id: 'eis',
          },
        ],
      },
      {
        assessment_id: 'wiw',
        question: 'What is your full name',
        question_answer: 'Hello world, lets make things happen again',
        question_id: 'owife',
        question_mark: 2,
        question_type: 'Structural',
        questionResources: [],
        questionOptions: [],
      },
    ];
    setQuestions(questions);
  }

  useEffect(() => {
    if (activeAssessment) loadQuestions(activeAssessment.assessment_id);
    return () => {
      //TODO: cleanup above axios fetch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAssessment]);

  function selectResponse(question: Question, response: string) {
    const { question_type, question_id } = question;
    let newQuestion: Question = { ...question };
    if (question_type === 'MCQ') {
      const options = question.questionOptions.map((option) => {
        if (option.question_option_id === response)
          return { ...option, is_answer: !option.is_answer };
        return option;
      });
      newQuestion = { ...question, questionOptions: options };
    } else {
      newQuestion = { ...question, question_answer: response };
    }

    const newQuestions = questions.map((question) => {
      const { question_id: q_id } = question;
      if (q_id === question_id) return newQuestion;
      return question;
    });

    setQuestions(newQuestions);
  }

  function getAssessmentEndTime() {
    const { assessment_date, duration } = activeAssessment;
    if (!assessment_date || !duration) return Infinity;
    return duration * 60000 + assessment_date.getTime();
  }

  const [days, hours, minutes, seconds] = useCountdown(
    new Date(getAssessmentEndTime())
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function submitAssessment(response: IQuestionStudentResponse[]) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'submittingAssessment',
      }),
    });
    setActiveAssessment(undefined);
    setTimeout(() => {
      //TODO: CALL API HERE TO submit assessment here
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        setIsSubmitting(false);
        notif.update({
          render: formatMessage({
            id: 'submittedAssessmentSuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => submitAssessment(response)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({
                id: 'submittAssessmentFailed',
              })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  }

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      const notif = new useNotification();
      notif.notify({ render: '...' });
      notif.update({
        render: formatMessage({ id: 'autoSubmittedAssessment' }),
        autoClose: 3000,
      });
      const responses: IQuestionStudentResponse[] = questions.map(
        ({ question_id, question_answer, question_type, questionOptions }) => {
          if (question_type === 'Structural')
            return {
              question_id,
              response: question_answer,
              answered_option_id: [],
            };
          else
            return {
              question_id,
              response: null,
              answered_option_id: questionOptions
                .filter(({ is_answer }) => is_answer)
                .map(({ question_option_id }) => question_option_id),
            };
        }
      );

      submitAssessment(responses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const [isConfirmSubmitDialogOpen, setIsConfirmSubmitDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <ConfirmSubmitAssessmentDialog
        isDialogOpen={isConfirmSubmitDialogOpen}
        closeDialog={() => setIsConfirmSubmitDialogOpen(false)}
        confirm={() => {
          const responses: IQuestionStudentResponse[] = questions.map(
            ({
              question_id,
              question_answer,
              question_type,
              questionOptions,
            }) => {
              if (question_type === 'Structural')
                return {
                  question_id,
                  response: question_answer,
                  answered_option_id: [],
                };
              else
                return {
                  question_id,
                  response: null,
                  answered_option_id: questionOptions
                    .filter(({ is_answer }) => is_answer)
                    .map(({ question_option_id }) => question_option_id),
                };
            }
          );
          setIsConfirmSubmitDialogOpen(false);
          submitAssessment(responses);
        }}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          rowGap: theme.spacing(1),
          height: '100%',
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
                onClick={() => setIsConfirmSubmitDialogOpen(true)}
                disabled={isSubmitting}
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
                <Typography>{formatMessage({ id: 'timeCounter' })}</Typography>
                <Chip
                  color="success"
                  sx={{ color: theme.common.offWhite, fontSize: '1.5rem' }}
                  label={`${
                    days < 0 ? '' : `${days} : `
                  } ${hours} : ${minutes} : ${seconds}`}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%' }}>
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
                  disabled={false}
                  question={question}
                  isActivated={true}
                  position={index + 1}
                  onDelete={() => alert('nothing')}
                  selectResponse={(question_option_id) =>
                    selectResponse(question, question_option_id)
                  }
                  key={index}
                />
              ))
            )}
          </Scrollbars>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ justifySelf: 'end', textTransform: 'none' }}
          disabled={isSubmitting}
          onClick={() => setIsConfirmSubmitDialogOpen(true)}
        >
          {formatMessage({ id: 'submitEvaluation' })}
        </Button>
      </Box>
    </>
  );
}
