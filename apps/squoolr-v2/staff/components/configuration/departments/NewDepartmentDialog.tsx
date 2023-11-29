import {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from '@glom/data-types/squoolr';
import { generateShort } from '@glom/utils';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function NewDepartmentDialog({
  closeDialog,
  isDialogOpen,
  editableDepartment,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  editableDepartment?: UpdateDepartmentPayload;
}) {
  //TODO: UpdateDepartmentPayload needs to have the department_id in it
  const { formatMessage } = useIntl();

  const initialValues: CreateDepartmentPayload = {
    department_acronym: editableDepartment?.department_acronym ?? '',
    department_name: editableDepartment?.department_name ?? '',
  };

  const validationSchema = Yup.object().shape({
    department_acronym: Yup.string().required(
      formatMessage({ id: 'requiredField' })
    ),
    department_name: Yup.string().required(
      formatMessage({ id: 'requiredField' })
    ),
  });

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (!!editableDepartment) {
        //TODO: CALL API HERE TO UPDATE DEPARTMENT WITH DATA values
      } else {
        //TODO: call api here to create department with data values
      }
      setIsSubmitting(true);
      setTimeout(() => {
        alert('done creating');
        close();
        resetForm();
        setIsSubmitting(false);
      }, 3000);
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(
    !editableDepartment
  );

  function close() {
    closeDialog();
    formik.resetForm();
    setIsCodeGenerated(true);
  }

  return (
    <Dialog
      onClose={() => (isSubmitting ? null : close())}
      open={isDialogOpen}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>
        {formatMessage({
          id: !!editableDepartment ? 'editDepartment' : 'addNewDepartment',
        })}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{ padding: '8px 16px 30px 16px', display: 'grid', rowGap: 2 }}
          onSubmit={formik.handleSubmit}
          component="form"
        >
          <TextField
            fullWidth
            required
            autoFocus
            size="small"
            label={formatMessage({ id: 'departmentName' })}
            placeholder={formatMessage({ id: 'departmentName' })}
            variant="outlined"
            error={
              formik.touched.department_name &&
              Boolean(formik.errors.department_name)
            }
            helperText={
              formik.touched.department_name && formik.errors.department_name
            }
            {...formik.getFieldProps('department_name')}
            onChange={(event) => {
              formik.setFieldValue('department_name', event.target.value);
              if (isCodeGenerated)
                formik.setFieldValue(
                  'department_acronym',
                  generateShort(event.target.value)
                );
            }}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            required
            size="small"
            label={formatMessage({ id: 'departmentAcronym' })}
            placeholder={formatMessage({ id: 'departmentAcronym' })}
            variant="outlined"
            error={
              formik.touched.department_acronym &&
              Boolean(formik.errors.department_acronym)
            }
            helperText={
              formik.touched.department_acronym &&
              formik.errors.department_acronym
            }
            {...formik.getFieldProps('department_acronym')}
            onChange={(event) => {
              if (isCodeGenerated && event.target.value.length > 0)
                setIsCodeGenerated(false);
              else if (!isCodeGenerated && event.target.value.length === 0)
                setIsCodeGenerated(true);
              formik.setFieldValue('department_acronym', event.target.value);
            }}
            disabled={isSubmitting}
          />
          <DialogActions>
            <Button
              variant="outlined"
              color="inherit"
              onClick={close}
              disabled={isSubmitting}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                isSubmitting ||
                (!!editableDepartment &&
                  editableDepartment.department_acronym ===
                    formik.values.department_acronym &&
                  editableDepartment.department_name ===
                    formik.values.department_name)
              }
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: !!editableDepartment ? 'save' : 'create' })}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
