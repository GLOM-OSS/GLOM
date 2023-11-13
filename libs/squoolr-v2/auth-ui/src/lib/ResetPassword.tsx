import { useTheme } from '@glom/theme';
import eye from '@iconify/icons-fluent/eye-32-regular';
import eyeSlash from '@iconify/icons-fluent/eye-hide-24-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import Footer from './Footer';
import { useResetPassword, useSetNewPassword } from '@glom/data-access/squoolr';
import { useRouter } from 'next/router';

export function ResetPassword() {
  const theme = useTheme();
  const {
    query: { reset_password_id: resetPasswordId },
  } = useRouter();
  const { formatMessage } = useIntl();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const initialValues: { newPassword: string; confirmPassword: string } = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required(formatMessage({ id: 'requiredField' })),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      formatMessage({ id: 'passwordMismatch' })
    ),
  });

  const { mutate: setNewPassword, isPending: isSubmitting } =
    useSetNewPassword();
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: ({ confirmPassword: new_password }, { resetForm }) => {
      //TODO: CHECK ON THE NOTIF HERE, AND UPDATE OneUI own
      setNewPassword(
        {
          new_password,
          reset_password_id: resetPasswordId as string,
        },
        {
          onSuccess() {
            resetForm();
          },
        }
      );
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
            {formatMessage({ id: `resetPassword` })}
          </Typography>
          <Typography
            className="p1"
            sx={{ color: `${theme.common.body} !important` }}
          >
            {formatMessage({ id: `enterYourNewPassword` })}
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
            label={formatMessage({ id: 'newPassword' })}
            placeholder={formatMessage({ id: 'newPassword' })}
            variant="outlined"
            type="password"
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            {...formik.getFieldProps('newPassword')}
            disabled={isSubmitting}
            size="small"
          />
          <TextField
            fullWidth
            required
            label={formatMessage({ id: 'confirmPassword' })}
            placeholder={formatMessage({ id: 'confirmPassword' })}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            {...formik.getFieldProps('confirmPassword')}
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'login' })}
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
