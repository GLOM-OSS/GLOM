import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { Chapter } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import * as Yup from 'yup';

export default function ChapterDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableChapter,
  isChapter,
  estimatedChapterNumber,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: Chapter) => void;
  closeDialog: () => void;
  editableChapter?: Chapter;
  estimatedChapterNumber: number;
  isChapter: boolean;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const initialValues: Chapter = editableChapter ?? {
    annual_credit_unit_subject_id: annual_credit_unit_subject_id as string,
    chapter_id: '',
    chapter_position: estimatedChapterNumber,
    chapter_objective: '',
    chapter_title: '',
    chapter_parent_id: '',
  };

  const validationSchema = Yup.object().shape({
    annual_credit_unit_subject_id: Yup.string(),
    chapter_parent_id: Yup.string(),
    chapter_position: Yup.number().min(
      0,
      formatMessage({ id: 'minAllowedValue0' })
    ),
    chapter_objective: Yup.string().required(formatMessage({ id: 'required' })),
    chapter_title: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
      close();
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {formatMessage({
            id: editableChapter
              ? isChapter
                ? 'editPart'
                : 'editChapter'
              : isChapter
              ? 'addPart'
              : 'addChapter',
          })}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: theme.spacing(2),
          }}
        >
          <TextField
            autoFocus
            sx={{ marginTop: theme.spacing(1) }}
            placeholder={formatMessage({
              id: isChapter ? 'partNumber' : 'chapterNumber',
            })}
            label={formatMessage({
              id: isChapter ? 'partNumber' : 'chapterNumber',
            })}
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('chapter_position')}
            error={
              formik.touched.chapter_position &&
              Boolean(formik.errors.chapter_position)
            }
            helperText={
              formik.touched.chapter_position && formik.errors.chapter_position
            }
          />
          <TextField
            placeholder={formatMessage({
              id: isChapter ? 'partTitle' : 'chapterTitle',
            })}
            label={formatMessage({
              id: isChapter ? 'partTitle' : 'chapterTitle',
            })}
            required
            color="primary"
            {...formik.getFieldProps('chapter_title')}
            error={
              formik.touched.chapter_title &&
              Boolean(formik.errors.chapter_title)
            }
            helperText={
              formik.touched.chapter_title && formik.errors.chapter_title
            }
          />
          <TextField
            placeholder={formatMessage({
              id: isChapter ? 'partObjective' : 'chapterObjective',
            })}
            label={formatMessage({
              id: isChapter ? 'partObjective' : 'chapterObjective',
            })}
            fullWidth
            multiline
            rows={5}
            required
            color="primary"
            {...formik.getFieldProps('chapter_objective')}
            error={
              formik.touched.chapter_objective &&
              Boolean(formik.errors.chapter_objective)
            }
            helperText={
              formik.touched.chapter_objective &&
              formik.errors.chapter_objective
            }
          />
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
          {editableChapter ? (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                editableChapter.chapter_position ===
                  formik.values.chapter_position &&
                editableChapter.chapter_title === formik.values.chapter_title &&
                editableChapter.chapter_objective ===
                  formik.values.chapter_objective
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          ) : (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
            >
              {formatMessage({ id: 'create' })}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
