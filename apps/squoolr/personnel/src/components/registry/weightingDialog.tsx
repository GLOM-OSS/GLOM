import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { getWeightingGrades } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { Grade, GradeWeighting } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function WeightingDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableWeighting,
  weightingSystem,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: GradeWeighting) => void;
  closeDialog: () => void;
  editableWeighting?: GradeWeighting;
  weightingSystem: number;
}) {
  const { formatMessage } = useIntl();
  const initialValues: GradeWeighting = editableWeighting ?? {
    annual_grade_weighting_id: 'weils',
    grade_value: '',
    maximum: weightingSystem,
    minimum: 0,
    observation: 'Toutes les ue',
    point: 0,
    grade_id: '',
    cycle_id: 'weils',
  };

  const validationSchema = Yup.object().shape({
    annual_grade_weighting_id: Yup.string(),
    grade_value: Yup.string(),
    observation: Yup.string(),
    minimum: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100, formatMessage({ id: 'lesserOrEqualWeighting' })),
    maximum: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100, formatMessage({ id: 'lesserOrEqualWeighting' })),
    point: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(weightingSystem, formatMessage({ id: 'lesserOrEqualWeighting' })),
    grade_id: Yup.string().required(formatMessage({ id: 'required' })),
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
  };

  const [areGradesLoading, setAreGradesLoading] = useState<boolean>(false);
  const [gradeNotif, setGradeNotif] = useState<useNotification>();
  const [grades, setGrades] = useState<Grade[]>([]);
  const loadGrades = () => {
    setAreGradesLoading(true);
    const notif = new useNotification();
    if (gradeNotif) {
      gradeNotif.dismiss();
    }
    setGradeNotif(notif);
    getWeightingGrades()
      .then((grades) => {
        setGrades(grades);
        setAreGradesLoading(false);
        notif.dismiss();
        setGradeNotif(undefined);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingGrades' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadGrades}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getGradesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadGrades();
    }
    return () => {
      //TODO: CLEANUP FETCH ABOVE
    };
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
            id: editableWeighting ? 'editWeighting' : 'newWeighting',
          })}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'minimum' })}
            label={formatMessage({ id: 'minimum' })}
            required
            color="primary"
            type="number"
            disabled={areGradesLoading}
            {...formik.getFieldProps('minimum')}
            error={formik.touched.minimum && Boolean(formik.errors.minimum)}
            helperText={formik.touched.minimum && formik.errors.minimum}
          />
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'maximum' })}
            label={formatMessage({ id: 'maximum' })}
            required
            color="primary"
            type="number"
            disabled={areGradesLoading}
            {...formik.getFieldProps('maximum')}
            error={formik.touched.maximum && Boolean(formik.errors.maximum)}
            helperText={formik.touched.maximum && formik.errors.maximum}
          />
          <TextField
            select
            placeholder={formatMessage({ id: 'grade' })}
            label={formatMessage({ id: 'grade' })}
            fullWidth
            required
            color="primary"
            disabled={areGradesLoading}
            {...formik.getFieldProps('grade_id')}
            error={formik.touched.grade_id && Boolean(formik.errors.grade_id)}
            helperText={formik.touched.grade_id && formik.errors.grade_id}
          >
            {grades.map(({ grade_value, grade_id }, index) => (
              <MenuItem key={index} value={grade_id}>
                {grade_value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'point' })}
            label={formatMessage({ id: 'point' })}
            required
            color="primary"
            type="number"
            disabled={areGradesLoading}
            {...formik.getFieldProps('point')}
            error={formik.touched.point && Boolean(formik.errors.point)}
            helperText={formik.touched.point && formik.errors.point}
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
          {editableWeighting ? (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                (editableWeighting.minimum === formik.values.minimum &&
                  editableWeighting.maximum === formik.values.maximum &&
                  editableWeighting.grade_id === formik.values.grade_id &&
                  editableWeighting.point === formik.values.point) ||
                areGradesLoading
              }
            >
              {formatMessage({ id: 'save' })}
            </Button>
          ) : (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              disabled={areGradesLoading}
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
