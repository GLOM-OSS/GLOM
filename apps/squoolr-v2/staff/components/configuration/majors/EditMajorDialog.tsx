import { useUpdateMajor } from '@glom/data-access/squoolr';
import { MajorEntity, UpdateMajorPayload } from '@glom/data-types/squoolr';
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

export default function EditMajorDialog({
  closeDialog,
  isDialogOpen,
  editableMajor,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  editableMajor: MajorEntity;
}) {
  const { formatMessage } = useIntl();

  const initialValues: UpdateMajorPayload = {
    major_acronym: editableMajor?.major_acronym ?? '',
    major_name: editableMajor?.major_name ?? '',
  };

  const validationSchema = Yup.object().shape({
    major_acronym: Yup.string().required(
      formatMessage({ id: 'requiredField' })
    ),
    major_name: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const { mutate: updateMajor, isPending: isSubmitting } = useUpdateMajor(
    editableMajor.annual_major_id
  );
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      updateMajor(values, {
        onSuccess() {
          close();
          resetForm();
        },
      });
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(false);

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
          id: 'editMajor',
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
            label={formatMessage({ id: 'majorName' })}
            placeholder={formatMessage({ id: 'majorName' })}
            variant="outlined"
            error={
              formik.touched.major_name && Boolean(formik.errors.major_name)
            }
            helperText={formik.touched.major_name && formik.errors.major_name}
            {...formik.getFieldProps('major_name')}
            onChange={(event) => {
              formik.setFieldValue('major_name', event.target.value);
              if (isCodeGenerated)
                formik.setFieldValue(
                  'major_acronym',
                  generateShort(event.target.value)
                );
            }}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            required
            size="small"
            label={formatMessage({ id: 'majorAcronym' })}
            placeholder={formatMessage({ id: 'majorAcronym' })}
            variant="outlined"
            error={
              formik.touched.major_acronym &&
              Boolean(formik.errors.major_acronym)
            }
            helperText={
              formik.touched.major_acronym && formik.errors.major_acronym
            }
            {...formik.getFieldProps('major_acronym')}
            onChange={(event) => {
              if (isCodeGenerated && event.target.value.length > 0)
                setIsCodeGenerated(false);
              else if (!isCodeGenerated && event.target.value.length === 0)
                setIsCodeGenerated(true);
              formik.setFieldValue('major_acronym', event.target.value);
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
                (editableMajor.major_acronym === formik.values.major_acronym &&
                  editableMajor.major_name === formik.values.major_name)
              }
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
