import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Chip, Fab, TextField, Typography } from '@mui/material';
import {
  getGroupSumbssionDetails,
  getStudentAnswers,
  submitCorrection,
} from '@squoolr/api-services';
import {
  Assessment,
  ICorrectedQuestion,
  ICorrectedSubmission,
  IGroupAssignment,
  IGroupAssignmentDetails,
  QuestionAnswer,
  StudentAssessmentAnswer,
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
  activeAssessment,
  activeAssessment: { submission_type, total_mark: totalMark, is_published },
}: {
  onBack: () => void;
  activeSubmission: SubmissionEntity;
  activeAssessment: Assessment;
}) {
  const { formatMessage, formatDate } = useIntl();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  const saveCorrectionHandler = (submission: ICorrectedSubmission) => {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'savingCorrection',
      }),
    });
    submitCorrection(activeAssessment.assessment_id, submission)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'savingCorrectionSuccessfull',
          }),
        });
        onBack();
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => saveCorrectionHandler(submission)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'saveCorrectionFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [areQuestionAnswersLoading, setAreQuestionAnswersLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const [groupDetails, setGroupDetails] = useState<IGroupAssignmentDetails>();

  const loadSubmissionDetails = (
    activeSubmission: SubmissionEntity,
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
      getGroupSumbssionDetails(
        assessment.assessment_id,
        (activeSubmission as IGroupAssignment).group_code
      )
        .then((groupDetails) => {
          setGroupDetails(groupDetails);
          setAreQuestionAnswersLoading(false);
          notif.dismiss();
          setQuestionNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingGroupDetails' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  loadSubmissionDetails(activeSubmission, assessment, isGroup)
                }
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getGroupDetailsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    } else
      loadQuestionAnswers(
        activeSubmission as Omit<StudentAssessmentAnswer, 'questionAnswers'>,
        assessment
      );
  };

  const loadQuestionAnswers = (
    activeStudent: Omit<StudentAssessmentAnswer, 'questionAnswers'>,
    assessment: Assessment
  ) => {
    setAreQuestionAnswersLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
    getStudentAnswers(assessment.assessment_id, activeStudent.annual_student_id)
      .then((questionAnswers) => {
        setQuestionAnswers(questionAnswers);
        setAreQuestionAnswersLoading(false);
        notif.dismiss();
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingQuestionAnswers' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadQuestionAnswers(activeStudent, assessment)
              }
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'questionAnswersFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadSubmissionDetails(
      activeSubmission,
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
    const modifiedQuestionIds = teacherCorrections.map(
      ({ question_id }) => question_id
    );

    const modifiedTotalMark = teacherCorrections.reduce(
      (total, { question_mark }) => total + question_mark,
      0
    );

    if (groupDetails) {
      const unModifiedQuestions = groupDetails.answers.filter(
        ({ question_id }) => !modifiedQuestionIds.includes(question_id)
      );

      const unModifiedTotalMark = unModifiedQuestions.reduce(
        (total, { acquired_mark }) => Number(acquired_mark ?? 0) + total,
        0
      );

      return unModifiedTotalMark + modifiedTotalMark;
    } else {
      const unModifiedQuestions = questionAnswers.filter(
        ({ question_id }) => !modifiedQuestionIds.includes(question_id)
      );

      const unModifiedTotalMark = unModifiedQuestions.reduce(
        (total, { acquired_mark }) => Number(acquired_mark ?? 0) + total,
        0
      );

      return modifiedTotalMark + unModifiedTotalMark;
    }
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
                    isPublished={is_published}
                    disabled={
                      isSubmitting ||
                      (activeAssessment.submission_type === 'Group' &&
                        !(activeSubmission as IGroupAssignment).is_submitted)
                    }
                    isResponse={true}
                    question={question}
                    position={index + 1}
                    isActivated={
                      activeAssessment.assessment_date ? true : false
                    }
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
                    isPublished={is_published}
                    disabled={
                      isSubmitting ||
                      (activeAssessment.submission_type === 'Group' &&
                        !(activeSubmission as IGroupAssignment).is_submitted)
                    }
                    isResponse={true}
                    question={question}
                    position={index + 1}
                    isActivated={
                      activeAssessment.assessment_date ? true : false
                    }
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
          {!is_published && (
            <Button
              variant="contained"
              color="primary"
              sx={{ justifySelf: 'end', textTransform: 'none' }}
              size="small"
              onClick={() => {
                if (activeAssessment.submission_type === 'Group') {
                  const cc = activeSubmission as IGroupAssignment;
                  const uploadData: ICorrectedSubmission = {
                    correctedAnswers: teacherCorrections,
                    group_code: cc.group_code,
                    givenScores: studentMarks.map(
                      ({ annual_student_id: as_id, mark }) => {
                        return { annual_student_id: as_id, total_score: mark };
                      }
                    ),
                  };
                  saveCorrectionHandler(uploadData);
                } else {
                  const cc = activeSubmission as Omit<
                    StudentAssessmentAnswer,
                    'questionAnswers'
                  >;
                  const uploadData: ICorrectedSubmission = {
                    correctedAnswers: teacherCorrections,
                    annual_student_id: cc.annual_student_id,
                  };

                  saveCorrectionHandler(uploadData);
                }
              }}
              disabled={
                areQuestionAnswersLoading ||
                isSubmitting ||
                (activeAssessment.submission_type === 'Group' &&
                  !(activeSubmission as IGroupAssignment).is_submitted)
              }
            >
              {formatMessage({ id: 'saveCorrection' })}
            </Button>
          )}
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
                <Box display="grid" rowGap={theme.spacing(1)}>
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
                        {is_published ? (
                          <Chip
                            color={
                              total_score < totalMark * 0.6
                                ? 'error'
                                : 'success'
                            }
                            sx={{ color: theme.common.offWhite }}
                            label={`${total_score} / ${totalMark}`}
                          />
                        ) : (
                          <TextField
                            size="small"
                            disabled={
                              isSubmitting ||
                              (activeAssessment.submission_type === 'Group' &&
                                !(activeSubmission as IGroupAssignment)
                                  .is_submitted)
                            }
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
                        )}
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
