import {
  useCreateMajor,
  useCycles,
  useDepartments,
} from '@glom/data-access/squoolr';
import {
  CreateMajorPayload
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
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function AddMajorDialog({
  closeDialog,
  isDialogOpen,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}) {
  const { formatMessage, formatNumber } = useIntl();

  const { data: cycles } = useCycles();
  const { data: departments } = useDepartments();

  const initialValues: CreateMajorPayload = {
    major_acronym: '',
    major_name: '',
    cycle_id: '',
    department_id: '',
  };

  const validationSchema = Yup.object().shape({
    major_acronym: Yup.string().required(
      formatMessage({ id: 'requiredField' })
    ),
    major_name: Yup.string().required(formatMessage({ id: 'requiredField' })),
    cycle_id: Yup.string()
      .oneOf(cycles ? cycles.map(({ cycle_id }) => cycle_id) : [])
      .required(formatMessage({ id: 'requiredField' })),
    department_id: Yup.string()
      .oneOf(
        departments ? departments.map(({ department_id }) => department_id) : []
      )
      .required(formatMessage({ id: 'requiredField' })),
  });

  const { mutate: createMajor, isPending: isSubmitting } = useCreateMajor();
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      createMajor(values, {
        onSuccess() {
          close();
          resetForm();
        },
      });
    },
  });

  const [isCodeGenerated, setIsCodeGenerated] = useState<boolean>(true);

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
          id: 'createMajor',
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
          <FormControl
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <InputLabel>{formatMessage({ id: 'departmentName' })}</InputLabel>
            <Select
              size="small"
              label={formatMessage({ id: 'departmentName' })}
              {...formik.getFieldProps('department_id')}
              required
              disabled={isSubmitting || !departments}
            >
              {departments.map(
                (
                  { department_id, department_acronym, department_name },
                  index
                ) => (
                  <MenuItem key={index} value={department_id}>
                    {`${department_name} (${department_acronym})`}
                  </MenuItem>
                )
              )}
            </Select>
            {formik.touched.department_id && (
              <FormHelperText>{formik.errors.department_id}</FormHelperText>
            )}
          </FormControl>
          <FormControl
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >
            <InputLabel>{formatMessage({ id: 'cursus' })}</InputLabel>
            <Select
              size="small"
              label={formatMessage({ id: 'cursus' })}
              {...formik.getFieldProps('cycle_id')}
              required
              disabled={isSubmitting || !cycles}
            >
              {cycles.map(
                ({ cycle_id, cycle_name, number_of_years }, index) => (
                  <MenuItem key={index} value={cycle_id}>
                    {`${formatMessage({ id: cycle_name })} (${formatNumber(
                      number_of_years,
                      {
                        style: 'unit',
                        unit: 'year',
                        unitDisplay: 'short',
                      }
                    )})`}
                  </MenuItem>
                )
              )}
            </Select>
            {formik.touched.cycle_id && (
              <FormHelperText>{formik.errors.cycle_id}</FormHelperText>
            )}
          </FormControl>

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
              disabled={isSubmitting}
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: 'create' })}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}