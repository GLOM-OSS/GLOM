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
import { DialogTransition } from '@glom/components';
import { theme } from '@glom/theme';
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
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {formatMessage({ id: 'validateDemand' })}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {formatMessage({ id: 'confirmValidationMessage' })}
          </DialogContentText>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'subdomain' })}
            fullWidth
            size="small"
            required
            error={formik.touched.subdomain && Boolean(formik.errors.subdomain)}
            helperText={formik.touched.subdomain && formik.errors.subdomain}
            {...formik.getFieldProps('subdomain')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    className="p3"
                    sx={{ color: `${theme.common.placeholder} !important` }}
                  >
                    {'https://www.'}
                  </Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    className="p3"
                    sx={{ color: `${theme.common.placeholder} !important` }}
                  >
                    {'.squoolr.com'}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: '20px',
          }}
        >
          <Button color="inherit" variant="outlined" onClick={closeDialog}>
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button color="primary" variant="contained" type="submit">
            {formatMessage({ id: 'validate' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
