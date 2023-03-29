import { ReportRounded } from '@mui/icons-material';
import { Box, Chip, Typography } from '@mui/material';
import { getStudentAnswers } from '@squoolr/api-services';
import {
  Assessment,
  ICorrectedQuestion,
  IGroupAssignment, QuestionAnswer,
  StudentAssessmentAnswer
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { SubmissionEntity } from '.';
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
  const { formatMessage } = useIntl();

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [areQuestionAnswersLoading, setAreQuestionAnswersLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const loadSubmissionDetails = (
    activeSubmission: SubmissionEntity,
    assessment: Assessment
  ) => {
    setAreQuestionAnswersLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
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
    loadSubmissionDetails(activeSubmission, activeAssessment);
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
          alignItems: 'center',
          gridAutoFlow: 'column',
          justifySelf: 'end',
          columnGap: theme.spacing(1),
        }}
      >
        <Typography>{formatMessage({ id: 'timeCounter' })}</Typography>
        <Chip
          color={'success'}
          sx={{ color: theme.common.offWhite }}
          label={0}
        />
      </Box>
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
        <Scrollbars autoHide>
          {areQuestionAnswersLoading ? (
            [...new Array(10)].map((_, index) => (
              <QuestionSkeleton key={index} />
            ))
          ) : questionAnswers.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {formatMessage({ id: 'noQuestions' })}
            </Typography>
          ) : (
            questionAnswers.map((question, index) => (
              <QuestionDisplay
                isPublished={is_published}
                disabled={
                  activeAssessment.submission_type === 'Group' &&
                  !(activeSubmission as IGroupAssignment).is_submitted
                }
                isResponse={true}
                question={question}
                position={index + 1}
                isActivated={activeAssessment.assessment_date ? true : false}
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
      </Box>
    </Box>
  );
}
