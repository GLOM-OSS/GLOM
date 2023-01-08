import { KeyboardBackspaceOutlined } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip, Tooltip,
    Typography
} from '@mui/material';
import {
    StudentAssessmentAnswer
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import QuestionDisplay from './questionDisplay';

export default function StudentResponse({
  onBack,
  activeStudent,
  totalMark
}: {
  onBack: () => void;
  activeStudent: StudentAssessmentAnswer;
  totalMark: number
}) {
  const { formatMessage } = useIntl();
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
        {activeStudent.questionAnswers.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {formatMessage({ id: 'noQuestionsResponded' })}
          </Typography>
        ) : (
          activeStudent.questionAnswers.map((question, index) => (
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
