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
import { theme } from '@glom/theme';
import { generateShort } from '@squoolr/utils';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export interface newDepartmentInterface {
  item_acronym: string;
  item_name: string;
}

export default function NewDepartmentDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
  editableDepartment,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleSubmit: (department: newDepartmentInterface) => void;
  editableDepartment?: newDepartmentInterface;
}) {
  const { formatMessage } = useIntl();
  const initialValues: newDepartmentInterface = editableDepartment ?? {
    item_acronym: '',
    item_name: '',
  };
  const validationSchema = Yup.object().shape({
    item_acronym: Yup.string().required(formatMessage({ id: 'required' })),
    item_name: Yup.string().required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
      close();
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(
    editableDepartment ? false : true
  );
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
          <DialogTitle>
            {formatMessage({
              id: editableDepartment ? 'editDepartment' : 'addNewDepartment',
            })}
          </DialogTitle>
          <TextField
            placeholder={formatMessage({ id: 'department_code' })}
            sx={{
              width: '120px',
              marginRight: theme.spacing(2),
              justifySelf: 'end',
            }}
            required
            color="primary"
            size="small"
            id="item_acronym"
            onBlur={formik.handleBlur}
            value={formik.values.item_acronym}
            disabled={Boolean(editableDepartment)}
            error={
              formik.touched.item_acronym && Boolean(formik.errors.item_acronym)
            }
            helperText={
              formik.touched.item_acronym && formik.errors.item_acronym
            }
            onChange={(event) => {
              setIsCodeGenerated(event.target.value.length === 0);
              formik.setFieldValue('item_acronym', event.target.value);
            }}
          />
        </Box>
        <DialogContent>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'department_name' })}
            fullWidth
            value={formik.values.item_name}
            id="item_name"
            required
            color="primary"
            onChange={(event) => {
              formik.setFieldValue('item_name', event.target.value);
              if (isCodeGenerated)
                formik.setFieldValue(
                  'item_acronym',
                  generateShort(event.target.value)
                );
            }}
            error={formik.touched.item_name && Boolean(formik.errors.item_name)}
            helperText={formik.touched.item_name && formik.errors.item_name}
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
          {editableDepartment && (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                editableDepartment.item_name === formik.values.item_name
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          )}
          {!editableDepartment && (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={formik.values.item_name === ''}
            >
              {formatMessage({ id: 'create' })}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
