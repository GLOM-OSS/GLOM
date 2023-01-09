import { AddPhotoAlternateOutlined, CloseOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

export default function QuestionDialog({
  isDialogOpen,
  //   handleSubmit,
  closeDialog,
  assessment_id,
  onSubmit,
}: {
  isDialogOpen: boolean;
  onSubmit: (
    val: CreateQuestion,
    res: {
      id: string;
      file: File;
    }[]
  ) => void;
  //   handleSubmit: (value: ActivateAssessment) => void;
  closeDialog: () => void;
  assessment_id: string;
}) {
  const { formatMessage } = useIntl();

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
      if (options.length > 0) {
        if (score > 0) {
          const submitData: CreateQuestion = {
            assessment_id,
            question,
            question_mark: score,
            questionOptions: options.map(({ is_answer, option }) => ({
              is_answer,
              option,
            })),
          };
          onSubmit(submitData, uploadFiles);
          close();
        } else
          alert(formatMessage({ id: 'questionMarkMustBeGreaterThanZero' }));
      } else alert(formatMessage({ id: 'questionMustHaveOptions' }));
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
          {formatMessage({
            id: 'createQuestion',
          })}
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
