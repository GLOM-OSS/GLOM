import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { CreditUnit, UEMajor } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function CreditUnitDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableCreditUnit,
  majors,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: CreditUnit) => void;
  closeDialog: () => void;
  editableCreditUnit?: CreditUnit;
  majors: UEMajor[];
}) {
  const { formatMessage } = useIntl();
  const initialValues: CreditUnit = editableCreditUnit ?? {
    annual_credit_unit_id: '',
    credit_points: 1,
    credit_unit_code: '',
    credit_unit_name: '',
    major_id: '',
    semester_number: 1,
  };

  const validationSchema = Yup.object().shape({
    annual_credit_unit_id: Yup.string(),
    credit_points: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(1, formatMessage({ id: 'minAllowedValue1' })),
    credit_unit_code: Yup.string().required(formatMessage({ id: 'required' })),
    credit_unit_name: Yup.string().required(formatMessage({ id: 'required' })),
    major_id: Yup.string().required(formatMessage({ id: 'required' })),
    semester_number: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(1, formatMessage({ id: 'minAllowedValue1' })),
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

  const close = () => {
    closeDialog();
    formik.resetForm();
    setSelectedMajor(undefined);
  };

  const [selectedMajor, setSelectedMajor] = useState<UEMajor>();

  useEffect(() => {
    if (editableCreditUnit && isDialogOpen) {
      setSelectedMajor(
        majors.find(
          ({ major_id: m_id }) => m_id === editableCreditUnit.major_id
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {formatMessage({
            id: editableCreditUnit ? 'editCreditUnit' : 'addNewCreditUnit',
          })}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'credit_unit_code' })}
            label={formatMessage({ id: 'credit_unit_code' })}
            required
            color="primary"
            {...formik.getFieldProps('credit_unit_code')}
            error={
              formik.touched.credit_unit_code &&
              Boolean(formik.errors.credit_unit_code)
            }
            helperText={
              formik.touched.credit_unit_code && formik.errors.credit_unit_code
            }
          />
          <TextField
            select
            placeholder={formatMessage({ id: 'major' })}
            label={formatMessage({ id: 'major' })}
            fullWidth
            required
            color="primary"
            {...formik.getFieldProps('major_id')}
            onChange={(event) => {
              formik.setFieldValue('major_id', event.target.value);
              setSelectedMajor(
                majors.find(({ major_id }) => major_id === event.target.value)
              );
            }}
            error={formik.touched.major_id && Boolean(formik.errors.major_id)}
            helperText={formik.touched.major_id && formik.errors.major_id}
          >
            {majors.map(({ major_name, major_id }, index) => (
              <MenuItem key={index} value={major_id}>
                {major_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            required
            {...formik.getFieldProps('credit_unit_name')}
            placeholder={formatMessage({ id: 'credit_unit_name' })}
            label={formatMessage({ id: 'credit_unit_name' })}
            color="primary"
            error={
              formik.touched.credit_unit_name &&
              Boolean(formik.errors.credit_unit_name)
            }
            helperText={
              formik.touched.credit_unit_name && formik.errors.credit_unit_name
            }
          />
          <TextField
            placeholder={formatMessage({ id: 'credit_points' })}
            label={formatMessage({ id: 'credit_points' })}
            fullWidth
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('credit_points')}
            error={
              formik.touched.credit_points &&
              Boolean(formik.errors.credit_points)
            }
            helperText={
              formik.touched.credit_points && formik.errors.credit_points
            }
          />
          <TextField
            select
            placeholder={formatMessage({ id: 'semester_number' })}
            label={formatMessage({ id: 'semester_number' })}
            fullWidth
            required
            color="primary"
            {...formik.getFieldProps('semester_number')}
            error={
              formik.touched.semester_number &&
              Boolean(formik.errors.semester_number)
            }
            helperText={
              formik.touched.semester_number && formik.errors.semester_number
            }
          >
            {selectedMajor ? (
              [...new Array(selectedMajor.number_of_years * 2)].map(
                (_, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                )
              )
            ) : (
              <MenuItem>{formatMessage({ id: 'selectMajor' })}</MenuItem>
            )}
          </TextField>
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
          {editableCreditUnit ? (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                editableCreditUnit.credit_points ===
                  formik.values.credit_points &&
                editableCreditUnit.credit_unit_code ===
                  formik.values.credit_unit_code &&
                editableCreditUnit.credit_unit_name ===
                  formik.values.credit_unit_name &&
                editableCreditUnit.major_id === formik.values.major_id &&
                editableCreditUnit.semester_number ===
                  formik.values.semester_number
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          ) : (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
            >
              {formatMessage({ id: 'create' })}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
