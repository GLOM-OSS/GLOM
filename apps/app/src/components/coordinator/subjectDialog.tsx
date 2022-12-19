import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { getTeachers, Personnel } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { DisplaySubject } from './subjectLane';

export default function SubjectDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  editableCreditUnit: editableSubject,
  subjects,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: DisplaySubject) => void;
  closeDialog: () => void;
  editableCreditUnit?: DisplaySubject;
  subjects: DisplaySubject[];
}) {
  const { formatMessage } = useIntl();
  const initialValues: DisplaySubject = editableSubject ?? {
    annual_credit_unit_id: '',
    annual_credit_unit_subject_id: '',
    guided_work: 0,
    main_teacher_fullname: '',
    objective: '',
    practical: 0,
    subject_code: '',
    subject_title: '',
    theory: 0.1,
    weighting: 0.1,
    annual_teacher_id: '',
  };

  const [teachers, setTeachers] = useState<Personnel[]>([]);
  const [areTeachersLoading, setAreTeachersLoading] = useState<boolean>(false);
  const [teacherNotif, setSubjectNotif] = useState<useNotification>();

  const loadTeachers = () => {
    setAreTeachersLoading(true);
    const notif = new useNotification();
    if (teacherNotif) {
      teacherNotif.dismiss();
    }
    setSubjectNotif(notif);
    getTeachers()
      .then((teachers) => {
        setTeachers(teachers);
        setAreTeachersLoading(false);
        notif.dismiss();
        setSubjectNotif(undefined);
      })
      .catch((error) => {
        notif.notify({ render: formatMessage({ id: 'loadingTeachers' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadTeachers}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getTeachersFailed' })
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
      loadTeachers();
    }
    return () => {
      //TODO: cleanup fetch teacher here
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  const getMaxAllowedWeighting = () => {
    let allowedValue: number;
    if (editableSubject)
      allowedValue =
        1 -
        subjects
          .map((_) =>
            _.annual_credit_unit_subject_id ===
            editableSubject.annual_credit_unit_subject_id
              ? { ..._, weighting: 0 }
              : _
          )
          .reduce((total, { weighting }) => {
            return weighting + total;
          }, 0);
    else
      allowedValue =
        1 -
        subjects.reduce((total, { weighting }) => {
          return weighting + total;
        }, 0);
    return allowedValue;
  };

  const validationSchema = Yup.object().shape({
    annual_credit_unit_id: Yup.string(),
    annual_credit_unit_subject_id: Yup.string(),
    main_teacher_full_name: Yup.string(),
    objective: Yup.string(),
    guided_work: Yup.number().min(0, formatMessage({ id: 'minAllowedValue1' })),
    theory: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .min(0.1, formatMessage({ id: 'minAllowedValue1' })),
    practical: Yup.number().min(0, formatMessage({ id: 'minAllowedValue1' })),
    subject_code: Yup.string().required(formatMessage({ id: 'required' })),
    subject_title: Yup.string().required(formatMessage({ id: 'required' })),
    annual_teacher_id: Yup.string().required(formatMessage({ id: 'required' })),
    weighting: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .max(
        getMaxAllowedWeighting(),
        formatMessage({ id: 'maxAllowedValue' })
      )
      .min(0.1, formatMessage({ id: 'minAllowedValue0' })),
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
            id: editableSubject ? 'editSubject' : 'addNewSubject',
          })}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'course_code' })}
            label={formatMessage({ id: 'course_code' })}
            required
            color="primary"
            {...formik.getFieldProps('subject_code')}
            error={
              formik.touched.subject_code && Boolean(formik.errors.subject_code)
            }
            helperText={
              formik.touched.subject_code && formik.errors.subject_code
            }
          />
          <TextField
            autoFocus
            placeholder={formatMessage({ id: 'course_title' })}
            label={formatMessage({ id: 'course_title' })}
            required
            color="primary"
            {...formik.getFieldProps('subject_title')}
            error={
              formik.touched.subject_title &&
              Boolean(formik.errors.subject_title)
            }
            helperText={
              formik.touched.subject_title && formik.errors.subject_title
            }
          />
          <TextField
            select
            placeholder={formatMessage({ id: 'teacher' })}
            label={formatMessage({ id: 'teacher' })}
            fullWidth
            required
            color="primary"
            disabled={areTeachersLoading}
            {...formik.getFieldProps('annual_teacher_id')}
            error={
              formik.touched.annual_teacher_id &&
              Boolean(formik.errors.annual_teacher_id)
            }
            helperText={
              formik.touched.annual_teacher_id &&
              formik.errors.annual_teacher_id
            }
          >
            {teachers.map(({ first_name, last_name, personnel_id }, index) => (
              <MenuItem key={index} value={personnel_id}>
                {`${first_name} ${last_name}`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            placeholder={formatMessage({ id: 'course_weighting' })}
            label={formatMessage({ id: 'course_weighting' })}
            fullWidth
            required
            color="primary"
            type="number"
            {...formik.getFieldProps('weighting')}
            error={formik.touched.weighting && Boolean(formik.errors.weighting)}
            helperText={formik.touched.weighting && formik.errors.weighting}
          />
          <TextField
            placeholder={formatMessage({ id: 'theory' })}
            label={formatMessage({ id: 'theory' })}
            fullWidth
            required
            color="primary"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">
                    {formatMessage({ id: 'hrs' })}
                  </Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('theory')}
            error={formik.touched.theory && Boolean(formik.errors.theory)}
            helperText={formik.touched.theory && formik.errors.theory}
          />
          <TextField
            placeholder={formatMessage({ id: 'practical' })}
            label={formatMessage({ id: 'practical' })}
            fullWidth
            color="primary"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">
                    {formatMessage({ id: 'hrs' })}
                  </Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('practical')}
            error={formik.touched.practical && Boolean(formik.errors.practical)}
            helperText={formik.touched.practical && formik.errors.practical}
          />
          <TextField
            placeholder={formatMessage({ id: 'guided_work' })}
            label={formatMessage({ id: 'guided_work' })}
            fullWidth
            color="primary"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">
                    {formatMessage({ id: 'hrs' })}
                  </Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('guided_work')}
            error={
              formik.touched.guided_work && Boolean(formik.errors.guided_work)
            }
            helperText={formik.touched.guided_work && formik.errors.guided_work}
          />
          <TextField
            multiline
            rows={5}
            placeholder={formatMessage({ id: 'course_objective' })}
            label={formatMessage({ id: 'course_objective' })}
            fullWidth
            color="primary"
            {...formik.getFieldProps('objective')}
            error={formik.touched.objective && Boolean(formik.errors.objective)}
            helperText={formik.touched.objective && formik.errors.objective}
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
          {editableSubject ? (
            <Button
              sx={{ textTransform: 'none' }}
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                editableSubject.subject_code === formik.values.subject_code &&
                editableSubject.subject_title === formik.values.subject_title &&
                editableSubject.annual_teacher_id ===
                  formik.values.annual_teacher_id &&
                editableSubject.theory === formik.values.theory &&
                editableSubject.guided_work === formik.values.guided_work &&
                editableSubject.practical === formik.values.practical &&
                editableSubject.weighting === formik.values.weighting &&
                editableSubject.objective === formik.values.objective
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
