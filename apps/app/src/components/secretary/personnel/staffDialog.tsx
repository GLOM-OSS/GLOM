import {
  Box,
  Button,
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
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import LocationPicker from './LocationPicker';

export interface StaffInterface {
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
}

export default function StaffDialog({
  close,
  handleConfirm,
  isDialogOpen,
  isEditDialog,
  activePersonnel,
  setIsEditing,
}: {
  close: () => void;
  handleConfirm: (values: StaffInterface, usage: 'edit'|'create') => void;
  isDialogOpen: boolean;
  isEditDialog?: boolean;
  activePersonnel?: StaffInterface;
  setIsEditing: (val: boolean) => void;
}) {
  const { formatMessage } = useIntl();
  const closeDialog = () => {
    close();
  };

  const initialValues: StaffInterface = activePersonnel
    ? {
        ...activePersonnel,
        date_of_birth: new Date(),
        gender: 'M',
        national_id_number: '000316122',
      }
    : {
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
      };

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
    is_archived: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleConfirm(values, isEditDialog?'edit':'create');
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
              ? 'editStaff'
              : activePersonnel !== undefined
              ? 'staffProfile'
              : 'addNewStaff',
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

            <FormControlLabel
              label={formatMessage({
                id: formik.values.is_archived ? 'outOfService' : 'inService',
              })}
              labelPlacement="start"
              sx={{ justifySelf: 'center' }}
              control={
                <Switch
                  disabled={
                    !isEditDialog ||
                    (activePersonnel !== undefined &&
                      !activePersonnel.is_archived)
                  }
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
              isEditDialog &&
              (Object.keys(formik.errors).length > 0 ||
                (activePersonnel !== undefined &&
                  !Object.keys(formik.values)
                    .map(
                      (key) =>
                        formik.values[key as keyof StaffInterface] ===
                          activePersonnel[key as keyof StaffInterface] &&
                        (formik.values[key as keyof StaffInterface] !== '' ||
                          formik.values[key as keyof StaffInterface] !==
                            undefined)
                    )
                    .includes(false)))
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
