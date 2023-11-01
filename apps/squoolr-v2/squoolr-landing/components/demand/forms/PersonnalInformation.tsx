import { SubmitSchoolDemandPayload } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  capitalize,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export interface IPersonalInformation
  extends Omit<
    SubmitSchoolDemandPayload['configurator'],
    'national_id_number'
  > {
  confirm_password: string;
}

export default function PersonnalInformation({
  data,
  onNext,
}: {
  data: IPersonalInformation;
  onNext: (val: IPersonalInformation) => void;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    first_name: Yup.string().required(formatMessage({ id: 'requiredField' })),
    gender: Yup.string()
      .oneOf(['Male', 'Female'], formatMessage({ id: 'allowedGenderError' }))
      .required(formatMessage({ id: 'requiredField' })),
    last_name: Yup.string().required(formatMessage({ id: 'requiredField' })),
    password: Yup.string().required(formatMessage({ id: 'requiredField' })),
    phone_number: Yup.string()
      .matches(
        /^(6[5-9]|2[3-7]|3[0-2])(\d{7})$/,
        formatMessage({ id: 'invalidPhonenumber' })
      )
      .required(formatMessage({ id: 'requiredField' })),
    birthdate: Yup.date().required().max(new Date()),
    confirm_password: Yup.string().oneOf(
      [Yup.ref('password'), null],
      formatMessage({ id: 'passwordMismatch' })
    ),
  });

  const formik = useFormik({
    initialValues: data,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onNext(values);
      resetForm();
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'grid', rowGap: 4, alignContent: 'start' }}
    >
      <Box sx={{ display: 'grid', rowGap: 2 }}>
        <TextField
          size="small"
          fullWidth
          required
          autoFocus
          label={formatMessage({ id: 'email' })}
          placeholder={formatMessage({ id: 'enterEmail' })}
          variant="outlined"
          type="email"
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps('email')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'firstName' })}
          placeholder={formatMessage({ id: 'firstName' })}
          variant="outlined"
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          {...formik.getFieldProps('first_name')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'lastName' })}
          placeholder={formatMessage({ id: 'lastName' })}
          variant="outlined"
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          {...formik.getFieldProps('last_name')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'gender' })}
          placeholder={formatMessage({ id: 'gender' })}
          variant="outlined"
          select
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          helperText={formik.touched.gender && formik.errors.gender}
          {...formik.getFieldProps('gender')}
        >
          {['male', 'female'].map((gender, index) => (
            <MenuItem key={index} value={capitalize(gender)}>
              {formatMessage({ id: gender })}
            </MenuItem>
          ))}
        </TextField>

        <MobileDatePicker
          label={formatMessage({ id: 'birthdate' })}
          renderInput={(params) => <TextField {...params} size="small" />}
          value={dayjs(formik.values.birthdate)}
          onChange={(value) =>
            formik.setFieldValue(
              'birthdate',
              new Date(dayjs(value).format()).toISOString()
            )
          }
        />

        <TextField
          size="small"
          InputProps={{
            startAdornment: (
              <Typography
                sx={{ color: theme.common.label }}
                variant="body1"
                mr={1}
              >
                (+237)
              </Typography>
            ),
          }}
          fullWidth
          required
          label={formatMessage({ id: 'phoneNumber' })}
          placeholder={formatMessage({ id: 'phoneNumber' })}
          variant="outlined"
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
          {...formik.getFieldProps('phone_number')}
        />

        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'password' })}
          placeholder={formatMessage({ id: 'password' })}
          variant="outlined"
          type="password"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          {...formik.getFieldProps('password')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'confirmPassword' })}
          placeholder={formatMessage({ id: 'confirmPassword' })}
          variant="outlined"
          type="password"
          error={
            formik.touched.confirm_password &&
            Boolean(formik.errors.confirm_password)
          }
          helperText={
            formik.touched.confirm_password && formik.errors.confirm_password
          }
          {...formik.getFieldProps('confirm_password')}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        color="primary"
        sx={{ justifySelf: 'end' }}
      >
        {formatMessage({ id: 'next' })}
      </Button>
    </Box>
  );
}
