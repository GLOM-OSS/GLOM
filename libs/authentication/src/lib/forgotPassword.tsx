import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { EmailRounded, ReportRounded } from '@mui/icons-material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import favicon from './logo.png';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';

export function ForgotPassword() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const initialValues: { email: string } = {
    email: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  });
  const navigate = useNavigate();
  const [isLinkSent, setIsLinkSent] = useState<boolean>(false);
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
        render: formatMessage({ id: 'sendingLink' }),
      });
      //TODO: CALL reset password API HERE
      setTimeout(() => {
        console.log(values);
        setIsSubmitting(false);
        if (random() > 5) {
          newNotification.update({
            render: formatMessage({ id: 'linkSent' }),
          });
          setIsLinkSent(true);
          resetForm();
        } else {
          newNotification.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={formik.handleSubmit}
                notification={newNotification}
                //TODO: MESSAGE SHOULD COME FROM BACKEND
                message={formatMessage({ id: 'failedToSendLink' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
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
            id: 'sendLinkSubtitle',
          })}
        </Typography>
        {!isLinkSent && (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              autoFocus
              required
              label={formatMessage({ id: 'email' })}
              placeholder={formatMessage({ id: 'enterEmail' })}
              variant="outlined"
              type="email"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              {...formik.getFieldProps('email')}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded color="primary" />
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
                formik.values.email === '' ||
                Boolean(formik.errors.email)
              }
              sx={{ marginTop: theme.spacing(6.25), textTransform: 'none' }}
            >
              {formatMessage({ id: 'sendLink' })}
            </Button>
          </form>
        )}
        {isLinkSent && (
          <Typography variant="h5">
            {formatMessage({ id: 'verifyMail' })}
          </Typography>
        )}
      </Box>
      {!isLinkSent && (
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
      )}
    </Box>
  );
}

export default ForgotPassword;
