import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function ValidateDemandDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleSubmit: (subdomain: string) => void;
}) {
  const { formatMessage } = useIntl();
  const initialValues: { subdomain: string } = {
    subdomain: '',
  };
  const validationSchema = Yup.object().shape({
    subdomain: Yup.string().required(
      formatMessage({ id: 'subdomainRequired' })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values.subdomain);
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
      <DialogTitle>{formatMessage({ id: 'validateDemand' })}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {formatMessage({ id: 'confirmValidationMessage' })}
          </DialogContentText>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'subdomain' })}
            fullWidth
            required
            error={formik.touched.subdomain && Boolean(formik.errors.subdomain)}
            helperText={formik.touched.subdomain && formik.errors.subdomain}
            {...formik.getFieldProps('subdomain')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">{'https://www.'}</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">{'.squoolr.com'}</Typography>
                </InputAdornment>
              ),
            }}
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
            color="primary"
            variant="contained"
            type="submit"
          >
            {formatMessage({ id: 'validate' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
