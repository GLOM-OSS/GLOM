import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Chip, Tooltip, Typography } from '@mui/material';
import { getStudentAnswers } from '@squoolr/api-services';
import {
  Assessment,
  QuestionAnswer,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import QuestionDisplay from './questionDisplay';
import QuestionSkeleton from './questionSkeleton';

export default function StudentResponse({
  onBack,
  activeStudent,
  totalMark,
  activeAssessment,
}: {
  onBack: () => void;
  activeStudent: Omit<StudentAssessmentAnswer, 'questionAnswers'>;
  totalMark: number;
  activeAssessment: Assessment;
}) {
  const { formatMessage } = useIntl();

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [areQuestionAnswersLoading, setAreQuestionAnswersLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

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
    loadQuestionAnswers(activeStudent, activeAssessment);
    return () => {
      //TODO: cleanup above axios fetch
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
          {`(${activeStudent.matricule}) ${activeStudent.fullname}`}
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
            color="success"
            sx={{ color: theme.common.offWhite }}
            label={`${activeStudent.total_score} / ${totalMark}`}
          />
        </Box>
      </Box>
      <Scrollbars autoHide>
        {areQuestionAnswersLoading ? (
          [...new Array(10)].map((_, index) => <QuestionSkeleton key={index} />)
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
              responses={question.answeredOptionIds}
              //   onEdit={() => setEditableQuestion(question)}
              onDelete={() => null}
              key={index}
            />
          ))
        )}
      </Scrollbars>
    </Box>
  );
}
