import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { Question, QuestionOption } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function QuestionDisplay({
  question: {
    question: q,
    questionOptions: qo,
    questionResources: qr,
    question_mark: qm,
  },
  position: p,
  onDelete,
  disabled,
  isResponse = false,
  responses,
}: {
  question: Question;
  position: number;
  onDelete: () => void;
  disabled: boolean;
  isResponse?: boolean;
  responses?: string[];
}) {
  const { formatMessage } = useIntl();
  const shuffleOptions = (array: QuestionOption[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: theme.spacing(2),
        paddingBottom: 1,
        marginBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.common.line}`,
      }}
    >
      <Typography>{`${p}.`}</Typography>
      <Box>
        <Typography>{q}</Typography>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            justifyContent: 'start',
            columnGap: theme.spacing(2),
            marginTop: theme.spacing(0.7),
            marginBottom: theme.spacing(1),
          }}
        >
          {qr.map(({ caption, resource_ref }, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                justifyContent: 'start',
                justifyItems: 'start',
              }}
            >
              <img
                src={resource_ref}
                alt={`fig${index}`}
                height="150px"
                width="150px"
                style={{ objectFit: 'cover' }}
              />
              <Typography variant="body2">{`${formatMessage({
                id: 'fig',
              })}. ${caption}`}</Typography>
            </Box>
          ))}
        </Box>
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
              gridAutoFlow: 'column',
              alignItems: 'center',
              justifyContent: 'start',
              columnGap: theme.spacing(1),
              marginTop: theme.spacing(0.5),
            }}
          >
            {(isResponse ? qo : shuffleOptions(qo)).map(
              ({ is_answer, option, question_option_id }, index) =>
                is_answer ? (
                  <Chip
                    color="success"
                    size="small"
                    label={`${String.fromCharCode(65 + index)}. ${option}`}
                  />
                ) : responses?.includes(question_option_id) ? (
                  <Chip
                    color="error"
                    size="small"
                    label={`${String.fromCharCode(65 + index)}. ${option}`}
                  />
                ) : (
                  <Typography>{`${String.fromCharCode(
                    65 + index
                  )}. ${option}`}</Typography>
                )
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(2),
              alignItems: 'end',
            }}
          >
            <Chip
              sx={{
                color: theme.common.offWhite,
                backgroundColor: theme.common.titleActive,
              }}
              label={qm}
            />
            {!isResponse && (
              <>
                <Tooltip arrow title={formatMessage({ id: 'edit' })}>
                  <IconButton size="small" disabled={disabled}>
                    <EditOutlined sx={{ color: theme.common.titleActive }} />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title={formatMessage({ id: 'delete' })}>
                  <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={onDelete}
                  >
                    <DeleteOutlined color="error" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
