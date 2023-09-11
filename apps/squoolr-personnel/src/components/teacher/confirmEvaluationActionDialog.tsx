import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function ConfirmEvaluationActionDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
  title,
  message,
  confirm,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  title: string;
  message: string;
  confirm: string;
  handleSubmit: (private_code: string) => void;
}) {
  const { formatMessage } = useIntl();
  const initialValues: { private_code: string } = {
    private_code: '',
  };
  const validationSchema = Yup.object().shape({
    private_code: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values.private_code);
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={() => {
        closeDialog();
        formik.resetForm();
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {message}
          </DialogContentText>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'teacherPrivateCode' })}
            fullWidth
            required
            color="primary"
            error={
              formik.touched.private_code && Boolean(formik.errors.private_code)
            }
            helperText={
              formik.touched.private_code && formik.errors.private_code
            }
            {...formik.getFieldProps('private_code')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color={title.toLowerCase().includes('reset') ? 'error' : 'primary'}
            size="small"
            variant={
              title.toLowerCase().includes('reset') ? 'text' : 'outlined'
            }
            onClick={() => {
              closeDialog();
              formik.resetForm();
            }}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color={title.toLowerCase().includes('reset') ? 'error' : 'primary'}
            size="small"
            variant="contained"
            type="submit"
          >
            {confirm}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
