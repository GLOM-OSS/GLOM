import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  lighten,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ICorrectedQuestion,
  Question,
  QuestionAnswer,
  QuestionOption,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { FileIcon } from '../coursePlan/fileDialog';

export default function QuestionDisplay({
  question: {
    question: q,
    questionOptions: qo,
    questionResources: qr,
    question_mark: qm,
    question_answer: qa,
    question_type: qt,
  },
  question,
  position: p,
  onDelete,
  disabled,
  isResponse = false,
  responses,
  isActivated,
  getTeacherCorrections,
  updatedCorrection,
  isPublished = false,
}: {
  isPublished?: boolean;
  question: Question | QuestionAnswer;
  position: number;
  onDelete: () => void;
  disabled: boolean;
  isResponse?: boolean;
  responses?: string[];
  isActivated: boolean;
  getTeacherCorrections?: (val: ICorrectedQuestion) => void;
  updatedCorrection?:
    | ICorrectedQuestion
    | {
        question_id: string;
        question_mark: number | null;
        teacher_comment: string | null;
      };
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
  const cc = question as QuestionAnswer;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: theme.spacing(2),
        paddingBottom: 1,
        marginBottom: theme.spacing(2),
        padding: 2,
        backgroundColor:
          !updatedCorrection ||
          (isResponse && updatedCorrection.question_mark !== null)
            ? 'initial'
            : lighten(theme.palette.secondary.main, 0.9),
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
          {qt === 'MCQ' ? (
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
          ) : qt === 'Structural' ? (
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              <Typography
                variant={'body2'}
                sx={{ fontStyle: isResponse ? 'italic' : 'normal' }}
              >
                {isResponse ? cc.response : qa}
              </Typography>
              {isResponse &&
                (isPublished || !cc.response ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: '300',
                      color: !cc.response ? theme.palette.error.main : '',
                    }}
                  >
                    {!cc.response
                      ? formatMessage({ id: 'studentDidNotAnswer' })
                      : updatedCorrection?.teacher_comment}
                  </Typography>
                ) : (
                  <TextField
                    variant="standard"
                    fullWidth
                    color="primary"
                    multiline
                    size="small"
                    disabled={disabled}
                    value={updatedCorrection?.teacher_comment}
                    onChange={(event) => {
                      if (getTeacherCorrections)
                        getTeacherCorrections({
                          question_mark: cc.acquired_mark ?? 0,
                          question_id: cc.question_id,
                          teacher_comment: event.target.value,
                        });
                    }}
                    placeholder={formatMessage({ id: 'teacherComment' })}
                  />
                ))}
            </Box>
          ) : (!isResponse && !qa) || (isResponse && !cc.response) ? (
            <Typography variant="body2" color={theme.palette.error.main}>
              {formatMessage({ id: 'noFileYet' })}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              <Box sx={{ justifySelf: 'start' }}>
                <FileIcon
                  name={`${
                    isResponse
                      ? (cc.response as string).split('.').slice(0, -1).join('')
                      : formatMessage({ id: 'correction' })
                  }.${
                    isResponse
                      ? (cc.response as string).split('.').slice(-1)[0]
                      : (qa as string).split('.').slice(-1)[0]
                  }`}
                  resource_ref={
                    isResponse ? (cc.response as string) : (qa as string)
                  }
                  resource_type="FILE"
                />
              </Box>
              {isResponse &&
                (isPublished ? (
                  <Typography variant="body2" sx={{ fontWeight: '300' }}>
                    {updatedCorrection?.teacher_comment}
                  </Typography>
                ) : (
                  <TextField
                    variant="standard"
                    fullWidth
                    color="primary"
                    multiline
                    size="small"
                    disabled={disabled}
                    value={updatedCorrection?.teacher_comment}
                    onChange={(event) => {
                      if (getTeacherCorrections)
                        getTeacherCorrections({
                          question_mark: cc.acquired_mark ?? 0,
                          question_id: cc.question_id,
                          teacher_comment: event.target.value,
                        });
                    }}
                    placeholder={formatMessage({ id: 'teacherComment' })}
                  />
                ))}
            </Box>
          )}
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(2),
              alignItems: 'end',
            }}
          >
            {isResponse && qt !== 'MCQ' ? (
              !cc.response ? (
                <Chip
                  color="error"
                  sx={{ color: theme.common.offWhite }}
                  label={`0 / ${qm}`}
                />
              ) : isPublished ? (
                <Chip
                  color={
                    Number(updatedCorrection?.question_mark) < qm * 0.6
                      ? 'error'
                      : 'success'
                  }
                  sx={{ color: theme.common.offWhite }}
                  label={`${updatedCorrection?.question_mark} / ${qm}`}
                />
              ) : (
                <TextField
                  type="number"
                  size="small"
                  disabled={disabled}
                  placeholder={formatMessage({ id: 'mark' })}
                  value={updatedCorrection?.question_mark}
                  //TODO: GIVEN MARK SHOULD NOT BE ABOVE qm
                  onChange={(event) => {
                    const val = Number(event.target.value);
                    if (val >= 0 && val <= cc.question_mark)
                      if (getTeacherCorrections)
                        getTeacherCorrections({
                          question_mark: val,
                          question_id: cc.question_id,
                          teacher_comment: cc.teacher_comment ?? '',
                        });
                  }}
                  sx={{
                    width: '80px',
                  }}
                  InputProps={{
                    endAdornment: `/${qm}`,
                  }}
                />
              )
            ) : (
              <Chip
                sx={{
                  color: theme.common.offWhite,
                  backgroundColor: theme.common.titleActive,
                }}
                label={!isResponse ? qm : cc.acquired_mark}
              />
            )}
            {!isResponse && !isActivated && (
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
