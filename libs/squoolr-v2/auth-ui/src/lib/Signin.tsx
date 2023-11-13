import { useTheme } from '@glom/theme';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  capitalize,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { IAppType } from './Auth.interfaces';
import Footer from './Footer';
import { Icon } from '@iconify/react';
import eye from '@iconify/icons-fluent/eye-32-regular';
import eyeSlash from '@iconify/icons-fluent/eye-hide-24-regular';
import { SignInPayload } from '@glom/data-types/squoolr';
import { useSignIn } from '@glom/data-access/squoolr';
import { useRouter } from 'next/router';

export function Signin({ app }: { app: IAppType }) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { push } = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const initialValues: SignInPayload = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    password: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const { mutate: signIn, isPending: isSubmitting } = useSignIn();
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      //TODO: CHECK ON THE NOTIF HERE, AND UPDATE OneUI own
      signIn(values, {
        onSuccess() {
          push('/management');
          resetForm();
        },
      });
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        alignContent: 'start',
        height: '100vh',
        rowGap: '65px',
        gridTemplateRows: '1fr auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'center',
          alignContent: 'start',
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
            InputProps={{
              endAdornment: (
                <Tooltip
                  arrow
                  title={formatMessage({
                    id: showPassword ? 'hidePassword' : 'showPassword',
                  })}
                >
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon icon={showPassword ? eyeSlash : eye} />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {formatMessage({ id: 'login' })}
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
