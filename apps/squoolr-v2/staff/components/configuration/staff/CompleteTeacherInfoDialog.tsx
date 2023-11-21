import { DialogTransition } from '@glom/components';
import {
  ManageStaffRolesPayload,
  StaffEntity,
  UpdateStaffPayload,
} from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

//TODO: EXPOSE THIS INTERFACES AN DELETE THIS
interface TeacherTypeEntity {
  teacher_type_id: string;
  teacher_type: string;
}

//TODO: EXPOSE THIS INTERFACES AN DELETE THIS
interface TeacherGradeEntity {
  teacher_grade_id: string;
  teacher_grade: string;
}

export default function CompleteTeacherInfoDialog({
  closeDialog,
  isDialogOpen,
  staff,
  isSubmitting,
  confirm,
}: {
  closeDialog: () => void;
  isDialogOpen: boolean;
  confirm: (staff: ManageStaffRolesPayload['teacherPayload']) => void;
  isSubmitting: boolean;
  staff?: ManageStaffRolesPayload['teacherPayload'];
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  //TODO: REMOVE THIS STATE AND USE reactQuery own
  const [isFetchingTeacherTypes] = useState<boolean>(false);
  //TODO: CALL API HER TO FETCH teacherTypes
  const [teacherTypes, setTeacherTypes] = useState<TeacherTypeEntity[]>([
    { teacher_type: 'Vacataire', teacher_type_id: '1' },
    { teacher_type: 'Permanent', teacher_type_id: '3' },
    { teacher_type: 'Missionnaire', teacher_type_id: '2' },
  ]);
  //TODO: REMOVE THIS STATE AND USE reactQuery own
  const [isFetchingTeacherGrades] = useState<boolean>(false);
  //TODO: CALL API HER TO FETCH teacherGrades
  const [teacherGrades, setTeacherGrades] = useState<TeacherGradeEntity[]>([
    { teacher_grade: 'Professeur', teacher_grade_id: '1' },
    { teacher_grade: 'Maitre des conferences', teacher_grade_id: '2' },
    { teacher_grade: 'Licencie', teacher_grade_id: '3' },
  ]);

  const initialValues: ManageStaffRolesPayload['teacherPayload'] = {
    role: 'TEACHER',
    has_signed_convention: staff ? staff.has_signed_convention : false,
    has_tax_payers_card: staff ? staff.has_tax_payers_card : false,
    hourly_rate: staff ? staff.hourly_rate : 0,
    origin_institute: staff ? staff.origin_institute : '',
    teacher_type_id: staff ? staff.teacher_type_id : '',
    teaching_grade_id: staff ? staff.teaching_grade_id : '',
  };
  const validationSchema = Yup.object().shape({
    has_signed_convention: Yup.boolean().required(
      formatMessage({ id: 'required' })
    ),
    has_tax_payers_card: Yup.boolean().required(
      formatMessage({ id: 'required' })
    ),
    hourly_rate: Yup.number()
      .positive()
      .required(formatMessage({ id: 'required' })),
    origin_institute: Yup.string().required(formatMessage({ id: 'required' })),
    teacher_type_id: Yup.string()
      .oneOf(teacherTypes.map(({ teacher_type_id }) => teacher_type_id))
      .required(formatMessage({ id: 'required' })),
    teaching_grade_id: Yup.string()
      .oneOf(teacherGrades.map(({ teacher_grade_id }) => teacher_grade_id))
      .required(formatMessage({ id: 'required' })),
  });

  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      resetForm();
      confirm(values);
    },
  });

  function close() {
    formik.resetForm();
    closeDialog();
  }

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={isDialogOpen}
      onClose={() => null}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>
        {formatMessage({
          id: `completeTeacherInformation`,
        })}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{ padding: '14px 0px 0px 0px', display: 'grid', rowGap: 2 }}
          onSubmit={formik.handleSubmit}
          component="form"
        >
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: 1,
                  paddingBottom: 1,
                },
              }}
            >
              <InputLabel>{formatMessage({ id: 'teacherType' })}</InputLabel>
              <Select
                size="small"
                label={formatMessage({ id: 'teacherType' })}
                {...formik.getFieldProps('teacher_type_id')}
                disabled={isFetchingTeacherTypes || isSubmitting}
                required
              >
                {teacherTypes.map(
                  ({ teacher_type, teacher_type_id }, index) => (
                    <MenuItem key={index} value={teacher_type_id}>
                      {teacher_type}
                    </MenuItem>
                  )
                )}
              </Select>
              {formik.touched.teacher_type_id &&
                !!formik.errors.teacher_type_id && (
                  <FormHelperText sx={{ color: theme.palette.error.main }}>
                    {formik.errors.teacher_type_id}
                  </FormHelperText>
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
              <InputLabel>{formatMessage({ id: 'teacherGrade' })}</InputLabel>
              <Select
                size="small"
                label={formatMessage({ id: 'teacherGrade' })}
                {...formik.getFieldProps('teaching_grade_id')}
                disabled={isFetchingTeacherGrades || isSubmitting}
                required
              >
                {teacherGrades.map(
                  ({ teacher_grade, teacher_grade_id }, index) => (
                    <MenuItem key={index} value={teacher_grade_id}>
                      {teacher_grade}
                    </MenuItem>
                  )
                )}
              </Select>
              {formik.touched.teaching_grade_id &&
                !!formik.errors.teaching_grade_id && (
                  <FormHelperText sx={{ color: theme.palette.error.main }}>
                    {formik.errors.teaching_grade_id}
                  </FormHelperText>
                )}
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <TextField
              fullWidth
              required
              size="small"
              label={formatMessage({ id: 'originInstitute' })}
              placeholder={formatMessage({ id: 'originInstitute' })}
              variant="outlined"
              error={
                formik.touched.origin_institute &&
                Boolean(formik.errors.origin_institute)
              }
              helperText={
                formik.touched.origin_institute &&
                formik.errors.origin_institute
              }
              {...formik.getFieldProps('origin_institute')}
              disabled={isSubmitting}
            />
            <TextField
              size="small"
              type="number"
              InputProps={{
                endAdornment: (
                  <Typography
                    sx={{ color: theme.common.label }}
                    variant="body1"
                    mr={1}
                  >
                    XAF
                  </Typography>
                ),
              }}
              fullWidth
              required
              label={formatMessage({ id: 'hourlyRate' })}
              placeholder={formatMessage({ id: 'hourlyRate' })}
              variant="outlined"
              error={
                formik.touched.hourly_rate && Boolean(formik.errors.hourly_rate)
              }
              helperText={
                formik.touched.hourly_rate && formik.errors.hourly_rate
              }
              {...formik.getFieldProps('hourly_rate')}
              disabled={isSubmitting}
            />
          </Box>
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <FormControlLabel
              checked={formik.values.has_signed_convention}
              disabled={isSubmitting}
              onChange={(event, checked) =>
                formik.setFieldValue('has_signed_convention', checked)
              }
              control={<Switch />}
              label={formatMessage({ id: 'hasSignedConvention' })}
            />
            <FormControlLabel
              checked={formik.values.has_tax_payers_card}
              disabled={isSubmitting}
              onChange={(event, checked) =>
                formik.setFieldValue('has_tax_payers_card', checked)
              }
              control={<Switch />}
              label={formatMessage({ id: 'hasTaxPayersCard' })}
            />
          </Box>
          <DialogActions
            sx={{
              justifyContent: 'center',
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: '20px',
              padding: '30px 0 0 0 !important',
            }}
          >
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => (isSubmitting ? null : close())}
              disabled={isSubmitting}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={isSubmitting}
              type="submit"
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
