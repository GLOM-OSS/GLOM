import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { LockPersonRounded, ReportRounded } from '@mui/icons-material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import favicon from './logo.png';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { setNewPassword } from '@squoolr/api-services';

export function NewPassword() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const initialValues: { confirmPassword: string; password: string } = {
    confirmPassword: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    password: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .oneOf(
        [Yup.ref('password'), null],
        formatMessage({ id: 'passwordMismatch' })
      ),
  });
  const navigate = useNavigate();
  const params = useParams();
  const [notifications, setNotifications] = useState<useNotification[]>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      if (notifications)
        notifications.forEach((notification) => notification.dismiss());
      const newNotification = new useNotification();
      if (notifications) setNotifications([...notifications, newNotification]);
      else setNotifications([newNotification]);
      newNotification.notify({
        render: formatMessage({ id: 'changingPassword' }),
      });
      setNewPassword(
        params['reset_password_id'] as string,
        values.confirmPassword
      )
        .then(() => {
          newNotification.update({
            render: formatMessage({ id: 'resetPasswordSuccess' }),
          });
          navigate('/');
          resetForm();
        })
        .catch((error) => {
          newNotification.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={formik.handleSubmit}
                notification={newNotification}
                message={
                  error?.message || formatMessage({ id: 'swapPasswordFailure' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsSubmitting(false));
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: theme.common.background,
        width: '100vw',
        minHeight: '100vh',
        color: theme.common.titleActive,
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <img src={favicon} alt="Squoolr icon" style={{ justifySelf: 'center' }} />
      <Box
        sx={{
          border: `2.5px solid ${theme.common.inputBackground}`,
          padding: `${theme.spacing(5)} ${theme.spacing(7.5)}`,
          display: 'grid',
          justifyItems: 'center',
          margin: `${theme.spacing(6.25)} 0`,
        }}
      >
        <Typography variant="h2">
          {formatMessage({ id: 'resetPassword' })}
        </Typography>
        <Typography sx={{ marginBottom: theme.spacing(6.25) }}>
          {formatMessage({
            id: 'swapPassword',
          })}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            autoFocus
            required
            label={formatMessage({ id: 'password' })}
            placeholder={formatMessage({ id: 'enterPassword' })}
            variant="outlined"
            type="password"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            {...formik.getFieldProps('password')}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockPersonRounded color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            required
            label={formatMessage({ id: 'confirmPassword' })}
            placeholder={formatMessage({ id: 'confirmPassword' })}
            variant="outlined"
            type="password"
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            sx={{ marginTop: theme.spacing(3.125) }}
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            {...formik.getFieldProps('confirmPassword')}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockPersonRounded color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={
              isSubmitting ||
              formik.values.password === '' ||
              formik.values.confirmPassword === '' ||
              Boolean(formik.errors.confirmPassword) ||
              Boolean(formik.errors.password)
            }
            sx={{ marginTop: theme.spacing(6.25), textTransform: 'none' }}
          >
            {formatMessage({ id: 'change' })}
          </Button>
        </form>
      </Box>
      <Typography
        sx={{ color: theme.common.placeholder, justifySelf: 'center' }}
        component="span"
      >
        {formatMessage({ id: 'rememberedPassword' })}{' '}
        <Typography
          sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
          onClick={() => navigate('/')}
          component="span"
        >
          {formatMessage({ id: 'signin' })}
        </Typography>
      </Typography>
    </Box>
  );
}

export default NewPassword;
