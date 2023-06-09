import { AddPhotoAlternateOutlined, CloseOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { CreateQuestion } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { acceptedFileFormats } from '../coursePlan/fileDisplayDialog';

export default function QuestionDialog({
  isDialogOpen,
  //   handleSubmit,
  closeDialog,
  assessment_id,
  onSubmit,
  isAssignment = false,
}: {
  isDialogOpen: boolean;
  isAssignment?: boolean;
  onSubmit: (
    val: CreateQuestion,
    res: {
      id: string;
      file: File;
    }[],
    answerFile?: File
  ) => void;
  //   handleSubmit: (value: ActivateAssessment) => void;
  closeDialog: () => void;
  assessment_id: string;
}) {
  const { formatMessage } = useIntl();

  const [activeQuestionType, setActiveQuestionType] = useState<
    'MCQ' | 'Structural' | 'File'
  >('MCQ');

  const [questionAnswer, setQuestionAnswer] = useState<string | File>();
  const [question, setQuestion] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [options, setOptions] = useState<
    { is_answer: boolean; option: string; id: string }[]
  >([]);

  const [uploadFiles, setUploadFiles] = useState<
    {
      id: string;
      file: File;
    }[]
  >([]);
  const [displayFiles, setDisplayFiles] = useState<
    { id: string; file: string }[]
  >([]);

  const close = () => {
    closeDialog();
    setQuestion('');
    setDisplayFiles([]);
    setUploadFiles([]);
    setOptions([]);
    setScore(0);
  };

  const submitQuestion = () => {
    if (question) {
      if (score > 0) {
        switch (activeQuestionType) {
          case 'File': {
            const submitData: CreateQuestion = {
              question,
              assessment_id,
              question_mark: score,
              question_type: 'File',
              question_answer: null,
            };
            onSubmit(submitData, uploadFiles, questionAnswer as File);
            close();
            break;
          }
          case 'MCQ': {
            if (options.length > 1) {
              if (options.find(({ is_answer }) => is_answer)) {
                const submitData: CreateQuestion = {
                  question,
                  assessment_id,
                  question_mark: score,
                  question_type: 'MCQ',
                  question_answer: null,
                  questionOptions: options.map(({ is_answer, option }) => ({
                    is_answer,
                    option,
                  })),
                };
                onSubmit(submitData, uploadFiles);
                close();
              } else
                alert(
                  formatMessage({ id: 'questionMustHaveAtLeastOneAnswer' })
                );
            } else
              alert(formatMessage({ id: 'questionMustHaveAtLeastTwoOptions' }));
            break;
          }
          case 'Structural': {
            const submitData: CreateQuestion = {
              question,
              assessment_id,
              question_mark: score,
              question_type: 'Structural',
              question_answer: questionAnswer ? (questionAnswer as string) : '',
            };
            onSubmit(submitData, uploadFiles);
            close();
            break;
          }
        }
      } else alert(formatMessage({ id: 'questionMarkMustBeGreaterThanZero' }));
    } else alert(formatMessage({ id: 'fillInQuestion' }));
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form
        style={{ minWidth: '50vw' }}
        onSubmit={(event) => {
          event.preventDefault();
          submitQuestion();
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr',
              columnGap: 2,
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              {formatMessage({
                id: 'createQuestion',
              })}
            </Typography>
            <FormControl>
              <InputLabel id="questionType">
                {formatMessage({ id: 'questionType' })}
              </InputLabel>
              <Select
                labelId="questionType"
                value={activeQuestionType}
                sx={{ minWidth: '200px' }}
                size="small"
                onChange={(event) => {
                  setActiveQuestionType(
                    event.target.value as 'MCQ' | 'Structural' | 'File'
                  );
                  setQuestionAnswer(undefined);
                }}
                input={
                  <OutlinedInput
                    label={formatMessage({ id: 'questionType' })}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                    },
                  },
                }}
              >
                {(isAssignment
                  ? ['MCQ', 'Structural', 'File']
                  : ['MCQ', 'Structural']
                ).map((_, index) => (
                  <MenuItem key={index} value={_}>
                    {formatMessage({ id: _ })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: theme.spacing(2),
              alignItems: 'start',
            }}
          >
            <TextField
              sx={{ marginTop: theme.spacing(1) }}
              placeholder={formatMessage({ id: 'question' })}
              label={formatMessage({ id: 'question' })}
              required
              color="primary"
              multiline
              rows={4}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
              }}
            />
            <Box>
              <input
                id="add-image-button"
                accept={['png', 'jpg', 'jpeg'].map((_) => `.${_}`).join(',')}
                multiple
                type="file"
                hidden
                onChange={(event) => {
                  const tt = event.target.files;
                  if (tt) {
                    const dFiles: {
                      id: string;
                      file: string;
                    }[] = [];
                    const upFiles: {
                      id: string;
                      file: File;
                    }[] = [];
                    [...new Array(tt.length)].forEach((_, index) => {
                      const lst = tt[index];
                      const bst = URL.createObjectURL(lst);
                      const id = crypto.randomUUID();
                      displayFiles.push({ id, file: bst });
                      uploadFiles.push({ id, file: lst });
                    });
                    setDisplayFiles([...displayFiles, ...dFiles]);
                    setUploadFiles([...uploadFiles, ...upFiles]);
                  }
                }}
              />
              <label htmlFor="add-image-button">
                <Tooltip arrow title={formatMessage({ id: 'addImages' })}>
                  <IconButton size="small" component="a">
                    <AddPhotoAlternateOutlined />
                  </IconButton>
                </Tooltip>
              </label>
            </Box>
          </Box>
          <Scrollbars
            autoHide
            style={{ height: displayFiles.length > 0 ? '220px' : 'initial' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'start',
                columnGap: theme.spacing(2),
              }}
            >
              {displayFiles.map(({ file, id }, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    justifyContent: 'start',
                    justifyItems: 'start',
                    position: 'relative',
                  }}
                >
                  <Tooltip arrow title={formatMessage({ id: 'remove' })}>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', left: 5, top: 5 }}
                      onClick={() => {
                        setDisplayFiles(
                          displayFiles.filter(({ id: s_id }) => s_id !== id)
                        );
                        setUploadFiles(
                          uploadFiles.filter(({ id: s_id }) => s_id !== id)
                        );
                      }}
                    >
                      <CloseOutlined fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                  <img
                    src={file}
                    alt={`fig${index}`}
                    height="200px"
                    width="200px"
                    style={{ objectFit: 'cover' }}
                  />
                  <Typography variant="body2">{`${formatMessage({
                    id: 'fig',
                  })}. ${index + 1}`}</Typography>
                </Box>
              ))}
            </Box>
          </Scrollbars>
          <TextField
            sx={{ marginTop: theme.spacing(1) }}
            placeholder={formatMessage({ id: 'score' })}
            label={formatMessage({ id: 'score' })}
            required
            color="primary"
            size="small"
            type="number"
            value={score}
            onChange={(event) => {
              const val = Number(event.target.value);
              if (val > 0) setScore(val);
            }}
          />
          <Box sx={{ display: 'grid' }}>
            {options.map((opt, index) => {
              const { is_answer, option, id } = opt;
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    columnGap: theme.spacing(1),
                    alignItems: 'end',
                  }}
                >
                  <Checkbox
                    checked={is_answer}
                    onChange={(event) => {
                      setOptions(
                        options.map((opt2) => {
                          if (opt2.id === id)
                            return { ...opt, is_answer: event.target.checked };
                          else return opt2;
                        })
                      );
                    }}
                  />
                  <TextField
                    sx={{ marginTop: theme.spacing(1) }}
                    placeholder={formatMessage({ id: 'option' })}
                    variant="standard"
                    required
                    color="primary"
                    value={option}
                    onChange={(event) => {
                      setOptions(
                        options.map((opt2) => {
                          if (opt2.id === id)
                            return { ...opt, option: event.target.value };
                          return opt2;
                        })
                      );
                    }}
                  />
                  <Tooltip arrow title={formatMessage({ id: 'delete' })}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setOptions(
                          options.filter(({ id: s_id }) => s_id !== id)
                        );
                      }}
                    >
                      <CloseOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              );
            })}
            {activeQuestionType === 'MCQ' ? (
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() =>
                  setOptions([
                    ...options,
                    { is_answer: false, option: '', id: crypto.randomUUID() },
                  ])
                }
                sx={{ justifySelf: 'end', textTransform: 'none' }}
              >
                {formatMessage({ id: 'addOption' })}
              </Button>
            ) : activeQuestionType === 'Structural' ? (
              <TextField
                multiline
                rows={4}
                placeholder={formatMessage({ id: 'questionAnswer' })}
                value={questionAnswer}
                onChange={(event) => setQuestionAnswer(event.target.value)}
              />
            ) : questionAnswer ? (
              <Typography color={theme.palette.success.main}>
                {formatMessage({ id: 'responseFileAdded' })}
              </Typography>
            ) : (
              <Box>
                <input
                  id="add-answer-button"
                  accept={acceptedFileFormats.map((_) => `.${_}`).join(',')}
                  type="file"
                  hidden
                  onChange={(event) => {
                    const tt = event.target.files;
                    if (tt) {
                      setQuestionAnswer(tt[0]);
                    }
                  }}
                />
                <label htmlFor="add-answer-button">
                  <Button variant="outlined" color="primary" component="span">
                    {formatMessage({ id: 'addAnswerFile' })}
                  </Button>
                </label>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            type="submit"
          >
            {formatMessage({ id: 'addQuestion' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
