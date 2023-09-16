import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { CreateLink } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import * as Yup from 'yup';

export default function ResourceDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  chapter_id,
  openFileDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: CreateLink) => void;
  closeDialog: () => void;
  chapter_id: string | null;
  openFileDialog: () => void;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const initialValues: CreateLink = {
    resource_name: '',
    resource_ref: '',
    annual_credit_unit_subject_id: annual_credit_unit_subject_id as string,
    chapter_id,
  };

  const validationSchema = Yup.object().shape({
    annual_credit_unit_subject_id: Yup.string(),
    chapter_id: Yup.string().nullable(),
    resource_name: Yup.string().required(formatMessage({ id: 'required' })),
    resource_ref: Yup.string().required(formatMessage({ id: 'required' })),
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            paddingRight: theme.spacing(3),
          }}
        >
          <DialogTitle>
            {formatMessage({
              id: chapter_id ? 'chapterLinkResource' : 'courseLinkResource',
            })}
          </DialogTitle>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{ width: 'fit-content', textTransform: 'none' }}
            onClick={openFileDialog}
          >
            {formatMessage({ id: 'fileResource' })}
          </Button>
        </Box>
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
              id: 'linkName',
            })}
            label={formatMessage({
              id: 'linkName',
            })}
            required
            color="primary"
            {...formik.getFieldProps('resource_name')}
            error={
              formik.touched.resource_name &&
              Boolean(formik.errors.resource_name)
            }
            helperText={
              formik.touched.resource_name && formik.errors.resource_name
            }
          />
          <TextField
            placeholder={formatMessage({
              id: 'link',
            })}
            label={formatMessage({
              id: 'link',
            })}
            required
            color="primary"
            {...formik.getFieldProps('resource_ref')}
            error={
              formik.touched.resource_ref && Boolean(formik.errors.resource_ref)
            }
            helperText={
              formik.touched.resource_ref && formik.errors.resource_ref
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
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            type="submit"
          >
            {formatMessage({ id: 'addLink' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
