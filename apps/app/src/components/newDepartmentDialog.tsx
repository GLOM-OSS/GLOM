import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { generateShort } from '@squoolr/utils';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function NewDepartmentDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleSubmit: (department: {
    department_name: string;
    department_code: string;
  }) => void;
}) {
  const { formatMessage } = useIntl();
  const initialValues: { department_code: string; department_name: string } = {
    department_code: '',
    department_name: '',
  };
  const validationSchema = Yup.object().shape({
    department_code: Yup.string().required(formatMessage({ id: 'required' })),
    department_name: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
      close();
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(true);
  const close = () => {
    closeDialog();
    formik.resetForm();
    setIsCodeGenerated(true);
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
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            marginTop: theme.spacing(1),
          }}
        >
          <DialogTitle>{formatMessage({ id: 'addNewDepartment' })}</DialogTitle>
          <TextField
            placeholder={formatMessage({ id: 'department_code' })}
            sx={{ width: '120px', marginRight: theme.spacing(2) }}
            required
            color="primary"
            size="small"
            id="department_code"
            onBlur={formik.handleBlur}
            value={formik.values.department_code}
            error={
              formik.touched.department_code &&
              Boolean(formik.errors.department_code)
            }
            helperText={
              formik.touched.department_code && formik.errors.department_code
            }
            onChange={(event) => {
              setIsCodeGenerated(event.target.value.length === 0);
              formik.setFieldValue('department_code', event.target.value);
            }}
          />
        </Box>
        <DialogContent>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'department_name' })}
            fullWidth
            value={formik.values.department_name}
            id="department_name"
            required
            color="primary"
            onChange={(event) => {
              formik.setFieldValue('department_name', event.target.value);
              if (isCodeGenerated)
                formik.setFieldValue(
                  'department_code',
                  generateShort(event.target.value)
                );
            }}
            error={
              formik.touched.department_name &&
              Boolean(formik.errors.department_name)
            }
            helperText={
              formik.touched.department_name && formik.errors.department_name
            }
            onBlur={formik.handleBlur}
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
            {formatMessage({ id: 'create' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
