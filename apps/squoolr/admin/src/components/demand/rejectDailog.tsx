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
import { theme } from '@glom/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function RejectDemandDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleSubmit: (reason: string) => void;
}) {
  const { formatMessage } = useIntl();
  const initialValues: { reason: string } = {
    reason: '',
  };
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required(formatMessage({ id: 'reasonRequired' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values.reason);
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle>{formatMessage({ id: 'rejectDemand' })}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {formatMessage({ id: 'confirmRejectionMessage' })}
          </DialogContentText>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'rejectionReason' })}
            fullWidth
            required
            multiline
            color="error"
            rows={4}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
            {...formik.getFieldProps('reason')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="outlined"
            onClick={closeDialog}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="contained"
            type="submit"
          >
            {formatMessage({ id: 'reject' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
