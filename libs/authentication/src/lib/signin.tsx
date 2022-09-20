import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  EmailRounded,
  LockPersonRounded,
  ReportRounded,
} from '@mui/icons-material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import favicon from './logo.png';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import {
  AcademicYearInterface,
  SelectAcademicYearDialog,
} from './selectAcademicYear';

export function Signin({
  callingApp,
}: {
  callingApp: 'student' | 'admin' | 'personnel';
}) {
  const intl = useIntl()
  const {formatMessage} = intl

  const initialValues: { email: string; password: string } = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });
  const navigate = useNavigate();
  const [isAcademicYearDialogOpen, setIsAcademicYearDialogOpen] =
    useState<boolean>(false);
  const [academicYears, setAcademicYears] = useState<AcademicYearInterface[]>(
    []
  );

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
        render: formatMessage({ id: 'signingUserIn' }),
      });
      //TODO: CALL SIGNIN API HERE
      setTimeout(() => {
        console.log(values);
        setIsSubmitting(false);
        if (random() > 5) {
          newNotification.update({
            render: formatMessage({ id: 'signinSuccess' }),
          });
          if (callingApp === 'admin') {
            navigate(localStorage.getItem('previousRoute') ?? '/dashboard');
          } else {
            //TODO: SET DATA IN ACADEMIC YEAR STATE HERE
            const newAcademicYears: AcademicYearInterface[] = [
              {
                academic_year_id: 'https:qwoeiofs/sldie',
                code: 'YEAR-202100012022',
                ending_date: new Date(),
                starting_date: new Date(),
                year_status: 'inactive',
              },
              {
                academic_year_id: 'https:qwwoeios/sldie',
                code: 'YEAR-1',
                ending_date: new Date(),
                starting_date: new Date(),
                year_status: 'inactive',
              },
              {
                academic_year_id: 'https:qwoerios/sldie',
                code: 'YEAR-1',
                ending_date: new Date(),
                starting_date: new Date(),
                year_status: 'active',
              },
              {
                academic_year_id: 'https:qwoeios/sldige',
                code: 'YEAR-1',
                ending_date: new Date(),
                starting_date: new Date(),
                year_status: 'finished',
              },
            ];
            //TODO: AUTO SIGN-IN USER IF ACADEMIC YEARS.length ===1
            setAcademicYears(newAcademicYears);
            setIsAcademicYearDialogOpen(true);
          }
          resetForm();
        } else {
          newNotification.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={formik.handleSubmit}
                notification={newNotification}
                message={formatMessage({ id: 'signinFailed' })}
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
    <>
      {callingApp !== 'admin' && (
        <SelectAcademicYearDialog
          academicYears={academicYears}
          closeDialog={() => setIsAcademicYearDialogOpen(false)}
          isDialogOpen={isAcademicYearDialogOpen}
        />
      )}
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
        <img
          src={favicon}
          alt="Squoolr icon"
          style={{ justifySelf: 'center' }}
        />
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
            {formatMessage({ id: 'welcomeBack' })}
          </Typography>
          <Typography sx={{ marginBottom: theme.spacing(6.25) }}>
            {formatMessage({
              id: 'enterCredentials',
            })}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
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
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              required
              label={formatMessage({ id: 'password' })}
              placeholder={formatMessage({ id: 'enterPassword' })}
              variant="outlined"
              type="password"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              {...formik.getFieldProps('password')}
              disabled={isSubmitting}
              sx={{ marginTop: theme.spacing(3.125) }}
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
                formik.values.email === ''
              }
              sx={{ marginTop: theme.spacing(6.25), textTransform: 'none' }}
            >
              {formatMessage({ id: 'signin' })}
            </Button>
          </form>
        </Box>
        {callingApp !== 'personnel' && (
          <Typography
            sx={{ color: theme.common.placeholder, justifySelf: 'center' }}
            component="span"
          >
            {formatMessage({ id: 'forgotPassword' })}{' '}
            <Typography
              sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
              component="span"
            >
              {formatMessage({ id: 'resetPassword' })}
            </Typography>
          </Typography>
        )}
      </Box>
    </>
  );
}

export default Signin;
