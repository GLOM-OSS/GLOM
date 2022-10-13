import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DialogTransition } from '@squoolr/dialogTransition';
import { theme } from '@squoolr/theme';
import {
  ErrorMessage,
  filterNotificationUsage,
  useNotification,
} from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import LocationPicker from './LocationPicker';
import { StaffInterface } from './staffDialog';

export interface TeacherInterface {
  personnel_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id_number: string;
  address: string;
  date_of_birth: Date;
  gender: 'M' | 'F';
  is_archived: boolean;
  teaching_grade:
    | 'gradeC'
    | 'gradeD'
    | 'conferenceMaster'
    | 'teacher'
    | 'assistant';
  teacher_type: 'partTime' | 'fullTime' | 'missionary';
  origin_school: string;
  hourly_rate: number;
  has_tax_payers_card: boolean;
  tax_payers_number: string;
  has_signed_convention: boolean;
}

export default function TeacherDialog({
  close,
  handleConfirm,
  isDialogOpen,
  isEditDialog,
  activePersonnel,
  setIsEditing,
}: {
  close: () => void;
  handleConfirm: (values: TeacherInterface, usage: 'edit' | 'create') => void;
  isDialogOpen: boolean;
  isEditDialog?: boolean;
  activePersonnel?: StaffInterface;
  setIsEditing: (val: boolean) => void;
}) {
  const { formatMessage } = useIntl();
  const closeDialog = () => {
    close();
  };

  const [teacher, setTeacher] = useState<TeacherInterface>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    national_id_number: '',
    address: '',
    date_of_birth: new Date(),
    gender: 'M',
    is_archived: false,
    personnel_code: '...',
    teaching_grade: 'teacher',
    teacher_type: 'fullTime',
    origin_school: '',
    hourly_rate: 0,
    has_tax_payers_card: false,
    tax_payers_number: '',
    has_signed_convention: false,
  });

  const [isTeacherLoading, setIsTeacherLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<
    {
      usage: string;
      notif: useNotification;
    }[]
  >([]);
  const getTeacher = () => {
    setIsTeacherLoading(true);

    const notif = new useNotification();
    setNotifications(filterNotificationUsage('load', notif, notifications));

    //TODO: CALL API TO FETCH TEACHER WITH CODE activePersonnel.personnel_code
    setTimeout(() => {
      if (random() > 5) {
        const newTeacher: TeacherInterface = {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          national_id_number: '',
          address: '',
          date_of_birth: new Date(),
          gender: 'M',
          is_archived: false,
          personnel_code: '...',
          teaching_grade: 'teacher',
          teacher_type: 'fullTime',
          origin_school: '',
          hourly_rate: 0,
          has_tax_payers_card: false,
          tax_payers_number: '',
          has_signed_convention: false,
        };

        setTeacher(newTeacher);
        setIsTeacherLoading(false);
        notif.dismiss();
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingTeacher' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getTeacher}
              notification={notif}
              //TODO: MESSAGE SHOULD COME FROM BACKEND
              message={formatMessage({ id: 'failedToLoadTeacher' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (isDialogOpen && activePersonnel !== undefined) {
      getTeacher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, activePersonnel]);

  const initialValues: TeacherInterface = teacher;

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.number().required(),
    national_id_number: Yup.string().required(),
    address: isEditDialog ? Yup.string() : Yup.string().required(),
    date_of_birth: Yup.date()
      .max(new Date(), formatMessage({ id: 'areYouATimeTraveler' }))
      .required(),
    gender: Yup.string().oneOf(['M', 'F']).required(),
    is_archived: Yup.boolean().required(),
    teaching_grade: Yup.string()
      .oneOf(['gradeC', 'gradeD', 'conferenceMaster', 'teacher', 'assistant'])
      .required(),
    teacher_type: Yup.string()
      .oneOf(['partTime', 'fullTimme', 'missionary'])
      .required(),
    origin_school: Yup.string().required(),
    hourly_rate: Yup.number().required(),
    has_tax_payers_card: Yup.boolean().required(),
    tax_payers_number: Yup.number(),
    has_signed_convention: Yup.boolean().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: isEditDialog && activePersonnel !== undefined,
    onSubmit: (values, { resetForm }) => {
      handleConfirm(values, isEditDialog ? 'edit' : 'create');
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
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          mr: theme.spacing(3),
        }}
      >
        <DialogTitle>
          {formatMessage({
            id: isEditDialog
              ? 'editTeacher'
              : activePersonnel !== undefined
              ? 'teacherProfile'
              : 'addNewTeacher',
          })}
        </DialogTitle>
        {activePersonnel !== undefined && (
          <TextField
            size="small"
            value={formik.values.personnel_code}
            disabled
            sx={{ width: '13ch', justifySelf: 'end' }}
          />
        )}
      </Box>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!isEditDialog && activePersonnel !== undefined) {
            setIsEditing(true);
          } else formik.handleSubmit();
        }}
      >
        <DialogContent
          sx={{
            display: 'grid',
            gridAutoFlow: 'row',
            rowGap: theme.spacing(2),
          }}
        >
          <TextField
            disabled={
              isTeacherLoading ||
              (!isEditDialog && activePersonnel !== undefined) ||
              (activePersonnel !== undefined && activePersonnel.is_archived)
            }
            autoFocus
            placeholder={formatMessage({ id: 'email' })}
            label={formatMessage({ id: 'email' })}
            fullWidth
            type="email"
            required
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            {...formik.getFieldProps('email')}
          />
          <TextField
            disabled={
              isTeacherLoading ||
              (!isEditDialog && activePersonnel !== undefined) ||
              (activePersonnel !== undefined && activePersonnel.is_archived)
            }
            placeholder={formatMessage({ id: 'first_name' })}
            label={formatMessage({ id: 'first_name' })}
            fullWidth
            required
            error={Boolean(
              formik.touched.first_name && formik.errors.first_name
            )}
            helperText={formik.touched.first_name && formik.errors.first_name}
            {...formik.getFieldProps('first_name')}
          />
          <TextField
            disabled={
              isTeacherLoading ||
              (!isEditDialog && activePersonnel !== undefined) ||
              (activePersonnel !== undefined && activePersonnel.is_archived)
            }
            placeholder={formatMessage({ id: 'last_name' })}
            label={formatMessage({ id: 'last_name' })}
            fullWidth
            required
            error={Boolean(formik.touched.last_name && formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
            {...formik.getFieldProps('last_name')}
          />
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(1),
            }}
          >
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              placeholder={formatMessage({ id: 'phone' })}
              label={formatMessage({ id: 'phone' })}
              fullWidth
              required
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              {...formik.getFieldProps('phone')}
            />
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              placeholder={formatMessage({ id: 'national_id_number' })}
              label={formatMessage({ id: 'national_id_number' })}
              fullWidth
              required
              error={Boolean(
                formik.touched.national_id_number &&
                  formik.errors.national_id_number
              )}
              helperText={
                formik.touched.national_id_number &&
                formik.errors.national_id_number
              }
              {...formik.getFieldProps('national_id_number')}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: theme.spacing(1),
            }}
          >
            <LocationPicker
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              required={true}
              initialValue={{
                description: formik.values.address,
                structured_formatting: {
                  main_text: '',
                  main_text_matched_substrings: [],
                  secondary_text: '',
                },
              }}
              handleChange={(location_value) => {
                formik.setFieldValue(
                  'address',
                  location_value !== null ? location_value.description : ''
                );
              }}
              label={formatMessage({ id: 'addressTextFieldLabel' })}
              handleBlur={() => formik.setFieldTouched('address')}
              error={Boolean(formik.touched.address && formik.errors.address)}
              helperText={
                formik.touched.address ? formik.errors.address : undefined
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label={formatMessage({ id: 'date_of_birth' })}
                value={formik.values.date_of_birth}
                onChange={(newValue) => {
                  formik.setFieldValue('date_of_birth', newValue);
                }}
                disabled={
                  isTeacherLoading ||
                  (!isEditDialog && activePersonnel !== undefined) ||
                  (activePersonnel !== undefined && activePersonnel.is_archived)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="primary"
                    size="medium"
                    fullWidth
                    error={
                      formik.touched.date_of_birth &&
                      Boolean(formik.errors.date_of_birth)
                    }
                    helperText={
                      formik.touched.date_of_birth &&
                      formik.errors.date_of_birth !== undefined &&
                      String(formik.errors.date_of_birth)
                    }
                    {...formik.getFieldProps('date_of_birth')}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: theme.spacing(1),
            }}
          >
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              select
              label={formatMessage({ id: 'gender' })}
              placeholder={formatMessage({ id: 'gender' })}
              fullWidth
              required
              {...formik.getFieldProps('gender')}
            >
              {[
                { value: 'M', text: 'Male' },
                { value: 'F', text: 'Female' },
              ].map(({ value, text }, index) => (
                <MenuItem key={index} value={value}>
                  {formatMessage({ id: text })}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              select
              label={formatMessage({ id: 'teaching_grade' })}
              placeholder={formatMessage({ id: 'teaching_grade' })}
              fullWidth
              required
              {...formik.getFieldProps('teaching_grade')}
            >
              {[
                'gradeC',
                'gradeD',
                'conferenceMaster',
                'teacher',
                'assistant',
              ].map((text, index) => (
                <MenuItem key={index} value={text}>
                  {formatMessage({ id: text })}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            disabled={
              isTeacherLoading ||
              (!isEditDialog && activePersonnel !== undefined) ||
              (activePersonnel !== undefined && activePersonnel.is_archived)
            }
            select
            label={formatMessage({ id: 'teacher_type' })}
            placeholder={formatMessage({ id: 'teacher_type' })}
            fullWidth
            required
            {...formik.getFieldProps('teacher_type')}
          >
            {['partTime', 'fullTime', 'missionary'].map((text, index) => (
              <MenuItem key={index} value={text}>
                {formatMessage({ id: text })}
              </MenuItem>
            ))}
          </TextField>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(1),
            }}
          >
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              placeholder={formatMessage({ id: 'origin_school' })}
              label={formatMessage({ id: 'origin_school' })}
              fullWidth
              required
              error={Boolean(
                formik.touched.origin_school && formik.errors.origin_school
              )}
              helperText={
                formik.touched.origin_school && formik.errors.origin_school
              }
              {...formik.getFieldProps('origin_school')}
            />
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              placeholder={formatMessage({ id: 'hourly_rate' })}
              label={formatMessage({ id: 'hourly_rate' })}
              fullWidth
              required
              error={Boolean(
                formik.touched.hourly_rate && formik.errors.hourly_rate
              )}
              helperText={
                formik.touched.hourly_rate && formik.errors.hourly_rate
              }
              {...formik.getFieldProps('hourly_rate')}
            />
          </Box>
          <FormControlLabel
            label={formatMessage({
              id: 'hasTaxPayersCard',
            })}
            labelPlacement="start"
            sx={{ justifySelf: 'center' }}
            control={
              <Switch
                disabled={
                  isTeacherLoading ||
                  !isEditDialog ||
                  activePersonnel?.is_archived
                }
                defaultChecked={formik.values.has_tax_payers_card}
                onChange={(event) =>
                  formik.setFieldValue(
                    'has_tax_payers_card',
                    event.target.checked
                  )
                }
                size="medium"
              />
            }
          />
          <Collapse in={formik.values.has_tax_payers_card}>
            <TextField
              disabled={
                isTeacherLoading ||
                (!isEditDialog && activePersonnel !== undefined) ||
                (activePersonnel !== undefined && activePersonnel.is_archived)
              }
              placeholder={formatMessage({ id: 'tax_payers_number' })}
              label={formatMessage({ id: 'tax_payers_number' })}
              fullWidth
              error={Boolean(
                formik.touched.tax_payers_number &&
                  formik.errors.tax_payers_number
              )}
              helperText={
                formik.touched.tax_payers_number &&
                formik.errors.tax_payers_number
              }
              {...formik.getFieldProps('tax_payers_number')}
            />
          </Collapse>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(1),
            }}
          >
            <FormControlLabel
              label={formatMessage({
                id: 'hasSignedConvention',
              })}
              labelPlacement="start"
              sx={{ justifySelf: 'center' }}
              control={
                <Switch
                  disabled={
                    isTeacherLoading ||
                    !isEditDialog ||
                    activePersonnel?.is_archived
                  }
                  defaultChecked={formik.values.has_signed_convention}
                  onChange={(event) =>
                    formik.setFieldValue(
                      'has_signed_convention',
                      event.target.checked
                    )
                  }
                  size="medium"
                />
              }
            />
            <FormControlLabel
              label={formatMessage({
                id: formik.values.is_archived ? 'outOfService' : 'inService',
              })}
              labelPlacement="start"
              sx={{ justifySelf: 'center' }}
              control={
                <Switch
                  disabled={isTeacherLoading || !isEditDialog}
                  defaultChecked={!formik.values.is_archived}
                  onChange={(event) =>
                    formik.setFieldValue('is_archived', !event.target.checked)
                  }
                  size="medium"
                />
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="text"
            onClick={closeDialog}
          >
            {formatMessage({
              id:
                !isEditDialog && activePersonnel !== undefined
                  ? 'close'
                  : 'cancel',
            })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            disabled={
              isTeacherLoading ||
              (isEditDialog &&
                (Object.keys(formik.errors).length > 0 ||
                  (activePersonnel !== undefined &&
                    !Object.keys(formik.values)
                      .map(
                        (key) =>
                          formik.values[key as keyof TeacherInterface] ===
                            teacher[key as keyof TeacherInterface] &&
                          (formik.values[key as keyof TeacherInterface] !==
                            '' ||
                            formik.values[key as keyof TeacherInterface] !==
                              undefined)
                      )
                      .includes(false))))
            }
            type="submit"
          >
            {formatMessage({
              id:
                !isEditDialog && activePersonnel !== undefined
                  ? 'editProfile'
                  : 'confirm',
            })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
