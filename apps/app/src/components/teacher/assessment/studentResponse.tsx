import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Fab, TextField,
  Typography
} from '@mui/material';
import {
  Assessment,
  ICorrectedQuestion,
  IGroupAssignment,
  IGroupAssignmentDetails,
  QuestionAnswer,
  StudentAssessmentAnswer
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { SubmissionEntity } from '../assignment';
import QuestionDisplay from './questionDisplay';
import QuestionSkeleton from './questionSkeleton';

export default function StudentResponse({
  onBack,
  activeSubmission,
  totalMark,
  activeAssessment,
  activeAssessment: { submission_type },
}: {
  onBack: () => void;
  activeSubmission: SubmissionEntity;
  totalMark: number;
  activeAssessment: Assessment;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [areQuestionAnswersLoading, setAreQuestionAnswersLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const [groupDetails, setGroupDetails] = useState<IGroupAssignmentDetails>();

  const loadSubmissionDetails = (
    activeStudent: Omit<StudentAssessmentAnswer, 'questionAnswers'>,
    assessment: Assessment,
    isGroup: boolean
  ) => {
    setAreQuestionAnswersLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
    if (isGroup) {
      setTimeout(() => {
        //TODO: CALL API HERE TO LOAD submissionsAnswers
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newDetails: IGroupAssignmentDetails = {
            assessment_id: 'wiels',
            group_code: 'XTG002',
            is_published: false,
            is_submitted: false,
            members: [
              {
                annual_student_id: 'ieos',
                approved_at: new Date(),
                first_name: 'Kouatchoua Tchakoumi',
                last_name: 'Lorrain',
                total_score: 0,
              },
            ],
            number_of_students: 2,
            total_score: 10,
            answers: [
              {
                answeredOptionIds: [],
                assessment_id: 'wieosl',
                question: 'Make it rain?',
                question_answer: '',
                question_id: 'wie',
                question_mark: 2,
                question_type: 'Structural',
                questionOptions: [],
                questionResources: [],
                response:
                  'Taking things into context, we need to make it rain heavily!',
                teacher_comment: 'Great work',
                acquired_mark: 2,
              },
              {
                answeredOptionIds: [],
                assessment_id: 'wieosl',
                question: 'Make it rain?',
                question_answer: '',
                question_id: 'wies',
                question_mark: 2,
                question_type: 'Structural',
                questionOptions: [],
                questionResources: [],
                response:
                  'Taking things into context, we need to make it rain heavily!',
                teacher_comment: 'Great work',
                acquired_mark: null,
              },
            ],
          };
          setGroupDetails(newDetails);
          setAreQuestionAnswersLoading(false);
          notif.dismiss();
          setQuestionNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingGroupDetails' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  loadSubmissionDetails(activeStudent, assessment, isGroup)
                }
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getGroupDetailsFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      setTimeout(() => {
        //TODO: CALL API HERE TO LOAD submissionsAnswers
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newSubmissions: QuestionAnswer[] = [
            {
              answeredOptionIds: [],
              assessment_id: 'wieosl',
              question: 'Make it rain?',
              question_answer: '',
              question_id: 'wie',
              question_mark: 2,
              question_type: 'Structural',
              questionOptions: [],
              questionResources: [],
              response:
                'Taking things into context, we need to make it rain heavily!',
              teacher_comment: 'Great work',
              acquired_mark: 2,
            },
          ];
          setQuestionAnswers(newSubmissions);
          setAreQuestionAnswersLoading(false);
          notif.dismiss();
          setQuestionNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingQuestionAnswers' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  loadSubmissionDetails(activeStudent, assessment, isGroup)
                }
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getQuestionAnswersFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  // const loadQuestionAnswers = (
  //   activeStudent: Omit<StudentAssessmentAnswer, 'questionAnswers'>,
  //   assessment: Assessment
  // ) => {
  //   setAreQuestionAnswersLoading(true);
  //   const notif = new useNotification();
  //   if (questionNotif) {
  //     questionNotif.dismiss();
  //   }
  //   setQuestionNotif(notif);
  //   getStudentAnswers(assessment.assessment_id, activeStudent.annual_student_id)
  //     .then((questionAnswers) => {
  //       setQuestionAnswers(questionAnswers);
  //       setAreQuestionAnswersLoading(false);
  //       notif.dismiss();
  //       setQuestionNotif(undefined);
  //     })
  //     .catch((error) => {
  //       notif.notify({
  //         render: formatMessage({ id: 'loadingQuestionAnswers' }),
  //       });
  //       notif.update({
  //         type: 'ERROR',
  //         render: (
  //           <ErrorMessage
  //             retryFunction={() =>
  //               loadQuestionAnswers(activeStudent, assessment)
  //             }
  //             notification={notif}
  //             message={
  //               error?.message || formatMessage({ id: 'questionAnswersFailed' })
  //             }
  //           />
  //         ),
  //         autoClose: false,
  //         icon: () => <ReportRounded fontSize="medium" color="error" />,
  //       });
  //     });
  // };

  useEffect(() => {
    loadSubmissionDetails(
      activeSubmission as Omit<StudentAssessmentAnswer, 'questionAnswers'>,
      activeAssessment,
      submission_type === 'Group'
    );
    return () => {
      //TODO: cleanup above axios fetch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [teacherCorrections, setTeacherCorrections] = useState<
    ICorrectedQuestion[]
  >([]);

  const getTeacherCorrections = (val: ICorrectedQuestion) => {
    const findQuestion = teacherCorrections.find(
      ({ question_id: q_id }) => q_id === val.question_id
    );
    if (findQuestion) {
      setTeacherCorrections([
        ...teacherCorrections.filter(
          ({ question_id: q_id }) => q_id !== val.question_id
        ),
        val,
      ]);
    } else setTeacherCorrections([...teacherCorrections, val]);
  };

  const getUpdatedCorrections = (
    question_id: string
  ): ICorrectedQuestion | undefined => {
    return teacherCorrections.find(
      ({ question_id: q_id }) => q_id === question_id
    );
  };

  const [studentMarks, setStudentMarks] = useState<
    { annual_student_id: string; mark: number }[]
  >([]);

  const computeTotalMark = () => {
    if (groupDetails) {
      const modifiedQuestionIds = teacherCorrections.map(
        ({ question_id }) => question_id
      );

      const unModifiedQuestions = groupDetails.answers.filter(
        ({ question_id }) => !modifiedQuestionIds.includes(question_id)
      );

      const unModifiedTotalMark = unModifiedQuestions.reduce(
        (total, { acquired_mark }) => Number(acquired_mark) + total,
        0
      );
      const modifiedTotalMark = teacherCorrections.reduce(
        (total, { question_mark }) => total + question_mark,
        0
      );

      return unModifiedTotalMark + modifiedTotalMark;
    }
    return 0;
  };

  useEffect(() => {
    if (groupDetails) {
      const groupStudentMarks = groupDetails.members.map(
        ({ annual_student_id }) => {
          return { annual_student_id, mark: computeTotalMark() };
        }
      );
      setStudentMarks(groupStudentMarks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherCorrections]);

  // management is the effective efficient correct and timely use of another persons property and resources for the purpose for which they were delegated with the view to produce the expected added value to the person

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
        <Fab
          color="primary"
          aria-label={formatMessage({ id: 'back' })}
          size="small"
          onClick={onBack}
        >
          <KeyboardBackspaceOutlined fontSize="small" />
        </Fab>
        <Typography variant="h6">
          {submission_type === 'Group'
            ? `${formatMessage({ id: 'groupCode' })}: ${
                (activeSubmission as IGroupAssignment).group_code
              }`
            : `(${(activeSubmission as StudentAssessmentAnswer).matricule}) ${
                (activeSubmission as StudentAssessmentAnswer).fullname
              }`}
        </Typography>

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
            color={computeTotalMark() < totalMark * 0.6 ? 'error' : 'success'}
            sx={{ color: theme.common.offWhite }}
            label={`${computeTotalMark()} / ${totalMark}`}
          />
        </Box>
      </Box>
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateColumns:
            submission_type === 'Group' ? '2.5fr 1fr' : '1fr',
          columnGap: 2,
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            rowGap: 0.5,
            gridTemplateRows: '1fr auto',
            paddingRight: submission_type === 'Group' ? 2 : 0,
            borderRight:
              submission_type === 'Group'
                ? `1px solid ${theme.common.line}`
                : 'none',
          }}
        >
          {submission_type === 'Individual' ? (
            <Scrollbars autoHide>
              {areQuestionAnswersLoading ? (
                [...new Array(10)].map((_, index) => (
                  <QuestionSkeleton key={index} />
                ))
              ) : questionAnswers.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {formatMessage({ id: 'noQuestionsResponded' })}
                </Typography>
              ) : (
                questionAnswers.map((question, index) => (
                  <QuestionDisplay
                    disabled={false}
                    isResponse={true}
                    question={question}
                    position={index + 1}
                    isActivated={activeAssessment.duration !== null}
                    responses={question.answeredOptionIds}
                    getTeacherCorrections={getTeacherCorrections}
                    //   onEdit={() => setEditableQuestion(question)}
                    onDelete={() => null}
                    key={index}
                    updatedCorrection={
                      getUpdatedCorrections(question.question_id) ?? {
                        question_id: question.question_id,
                        question_mark: question.acquired_mark,
                        teacher_comment: question.teacher_comment,
                      }
                    }
                  />
                ))
              )}
            </Scrollbars>
          ) : (
            <Scrollbars autoHide>
              {areQuestionAnswersLoading || groupDetails === undefined ? (
                [...new Array(10)].map((_, index) => (
                  <QuestionSkeleton key={index} />
                ))
              ) : groupDetails.answers.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {formatMessage({ id: 'noQuestionsResponded' })}
                </Typography>
              ) : (
                groupDetails.answers.map((question, index) => (
                  <QuestionDisplay
                    disabled={false}
                    isResponse={true}
                    question={question}
                    position={index + 1}
                    isActivated={activeAssessment.duration !== null}
                    responses={question.answeredOptionIds}
                    getTeacherCorrections={getTeacherCorrections}
                    //   onEdit={() => setEditableQuestion(question)}
                    onDelete={() => null}
                    key={index}
                    updatedCorrection={
                      getUpdatedCorrections(question.question_id) ?? {
                        question_id: question.question_id,
                        question_mark: question.acquired_mark,
                        teacher_comment: question.teacher_comment,
                      }
                    }
                  />
                ))
              )}
            </Scrollbars>
          )}
          <Button
            variant="outlined"
            color="primary"
            sx={{ justifySelf: 'end', textTransform: 'none' }}
            size="small"
            disabled={areQuestionAnswersLoading}
          >
            {formatMessage({ id: 'saveCorrection' })}
          </Button>
        </Box>
        {submission_type === 'Group' && (
          <Box
            sx={{
              display: 'grid',
              height: '100%',
              gridTemplateRows: 'auto 1fr',
              rowGap: 3,
            }}
          >
            <Typography variant="h6">
              {formatMessage({ id: 'studentList' })}
            </Typography>
            <Scrollbars autoHide>
              {areQuestionAnswersLoading || !groupDetails ? (
                <Box>{[...new Array(10)]}</Box>
              ) : (
                <Box>
                  {groupDetails.members.map(
                    (
                      {
                        first_name: fn,
                        last_name: ln,
                        total_score,
                        approved_at,
                        annual_student_id: as_id,
                      },
                      index
                    ) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 62px auto',
                          columnGap: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Typography>{`${fn}`}</Typography>
                        <TextField
                          size="small"
                          value={
                            studentMarks.find(
                              ({ annual_student_id }) =>
                                annual_student_id === as_id
                            )?.mark ?? total_score
                          }
                          onChange={(event) => {
                            const val = studentMarks.find(
                              ({ annual_student_id }) =>
                                annual_student_id === as_id
                            );
                            const tt = Number(event.target.value);
                            if (tt >= 0 && tt <= computeTotalMark())
                              if (val) {
                                setStudentMarks([
                                  ...studentMarks.filter(
                                    ({ annual_student_id: ast_id }) =>
                                      ast_id !== as_id
                                  ),
                                  {
                                    annual_student_id: as_id,
                                    mark: tt,
                                  },
                                ]);
                              } else {
                                setStudentMarks([
                                  ...studentMarks,
                                  {
                                    annual_student_id: as_id,
                                    mark: tt,
                                  },
                                ]);
                              }
                          }}
                          variant="outlined"
                          type="number"
                          placeholder={formatMessage({ id: 'studentScore' })}
                        />
                        <Typography>
                          {approved_at
                            ? formatDate(new Date(approved_at), {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone:
                                  Intl.DateTimeFormat().resolvedOptions()
                                    .timeZone,
                              })
                            : formatMessage({ id: 'notAvailable' })}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Scrollbars>
          </Box>
        )}
      </Box>
    </Box>
  );
}
