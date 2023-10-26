import { Box, Button, TextField, Typography, capitalize } from '@mui/material';
import { useIntl } from 'react-intl';
import { IAppType } from './Auth.interfaces';
import { useTheme } from '@glom/theme';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export function Signin({ app }: { app: IAppType }) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const initialValues: { email: string; password: string } = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    password: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      //TODO: INTEGRATE SIGN IN HERE
      //TODO: CHECK ON THE NOTIF HERE, AND UPDATE OneUI own
      alert(JSON.stringify(values));
      setIsSubmitting(true);
      resetForm();
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'start',
        height: '100vh',
        rowGap: '65px',
      }}
    >
      <Box
        sx={{
          marginTop: '140px',
          display: 'grid',
          justifyItems: 'center',
          alignContent: 'start',
          rowGap: 2.5,
        }}
      >
        <img src="/logo.png" alt="Squoolr logo" />
        <Typography
          variant="h1"
          sx={{ color: `${theme.common.titleActive} !important` }}
        >
          {formatMessage({ id: `welcomeBack${capitalize(app)}` })}
        </Typography>
        <Typography
          className="p1"
          sx={{ color: `${theme.common.body} !important` }}
        >
          {formatMessage({ id: `pleaseEnterYourDetails` })}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: 3 }}
      >
        <TextField
          fullWidth
          required
          autoFocus
          label={formatMessage({ id: 'email' })}
          placeholder={formatMessage({ id: 'email' })}
          variant="outlined"
          type="email"
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps('email')}
          disabled={isSubmitting}
          size="small"
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'password' })}
          placeholder={formatMessage({ id: 'password' })}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          {...formik.getFieldProps('password')}
          disabled={isSubmitting}
          size="small"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {formatMessage({ id: 'login' })}
        </Button>
      </Box>
    </Box>
  );
}
