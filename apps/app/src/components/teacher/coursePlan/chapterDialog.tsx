import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
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
  estimatedChapterNumber,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: Chapter) => void;
  closeDialog: () => void;
  editableChapter?: Chapter;
  estimatedChapterNumber: number;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const initialValues: Chapter = editableChapter ?? {
    annual_credit_unit_subject_id: annual_credit_unit_subject_id as string,
    chapter_id: '',
    chapter_number: estimatedChapterNumber,
    chapter_objective: '',
    chapter_title: '',
    chapter_parent_id: '',
  };

  const validationSchema = Yup.object().shape({
    annual_credit_unit_subject_id: Yup.string(),
    chapter_parent_id: Yup.string(),
    chapter_number: Yup.number().min(
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
            id: editableChapter ? 'editChapter' : 'addChapter',
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
            placeholder={formatMessage({ id: 'chapterNumber' })}
            label={formatMessage({ id: 'chapterNumber' })}
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('chapter_number')}
            error={
              formik.touched.chapter_number &&
              Boolean(formik.errors.chapter_number)
            }
            helperText={
              formik.touched.chapter_number && formik.errors.chapter_number
            }
          />
          <TextField
            placeholder={formatMessage({ id: 'chapterTitle' })}
            label={formatMessage({ id: 'chapterTitle' })}
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
            placeholder={formatMessage({ id: 'chapterObjective' })}
            label={formatMessage({ id: 'chapterObjective' })}
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
                editableChapter.chapter_number ===
                  formik.values.chapter_number &&
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
