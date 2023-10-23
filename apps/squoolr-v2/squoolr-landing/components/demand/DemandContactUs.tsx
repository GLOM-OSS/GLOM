import { PhoneTextField } from '@glom/components';
import { useTheme } from '@glom/theme';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { ICreateContactUs } from '../../components/contact-us/ContactUs';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DemandContactUs() {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDemandSubmitted, setIsDemandSubmitted] = useState<boolean>(false);

  const initialValues: ICreateContactUs = {
    email: '',
    phone: '',
    fullname: '',
    message: formatMessage({ id: 'demandMessage' }),
    type: 'Default',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    fullname: Yup.string().required(formatMessage({ id: 'requiredField' })),
    phone: Yup.string().required(formatMessage({ id: 'requiredField' })),
    message: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      //TODO: INTEGRATE CONTACT US HERE
      //TODO: CHECK ON THE NOTIF HERE, AND UPDATE OneUI own
      alert(JSON.stringify(values));
      setIsSubmitting(true);
      setIsDemandSubmitted(true);
      resetForm();
    },
  });

  return (
    <Box
      sx={{
        marginTop: '70px',
        display: { mobile: 'block', laptop: 'none' },
      }}
    >
      <Box
        sx={{
          padding: '30px 24px',
          display: 'grid',
          justifyItems: 'center',
          rowGap: 2,
        }}
      >
        <img src="logo.png" alt="squoolr logo" />
        <Box
          sx={{
            display: 'grid',
            rowGap: isDemandSubmitted ? 5 : 0.5,
            justifyItems: 'center',
          }}
        >
          <Typography
            variant="h1"
            className="h1--mobile"
            sx={{ paddingBottom: 0, textAlign: 'center' }}
          >
            {formatMessage({
              id: isDemandSubmitted ? 'demandSubmitted' : 'submitDemand',
            })}
          </Typography>
          <Typography
            variant="h4"
            className="h4--mobile"
            sx={{
              color: theme.common.label,
              textAlign: 'center',
            }}
          >
            {formatMessage({
              id: isDemandSubmitted
                ? 'demandSubmittedSubtitle'
                : `submitDemandSubtitle`,
            })}
          </Typography>
          {isDemandSubmitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => push('/')}
            >
              {formatMessage({ id: 'goHome' })}
            </Button>
          )}
        </Box>
      </Box>
      {!isDemandSubmitted && (
        <Box
          sx={{
            padding: '0 16px 30px 16px',
            display: 'grid',
            rowGap: 2,
            justifySelf: 'center',
          }}
          onSubmit={formik.handleSubmit}
          component="form"
        >
          <TextField
            fullWidth
            required
            autoFocus
            label={formatMessage({ id: 'fullname' })}
            placeholder={formatMessage({ id: 'fullname' })}
            variant="outlined"
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
            {...formik.getFieldProps('fullname')}
            disabled={isSubmitting}
          />
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
          />
          <PhoneTextField formik={formik} field="phone" />

          <TextField
            fullWidth
            required
            label={formatMessage({
              id: 'message',
            })}
            placeholder={formatMessage({
              id: 'writeYourMessageHere',
            })}
            variant="outlined"
            multiline
            rows={5}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
            {...formik.getFieldProps('message')}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'submit' })}
          </Button>
        </Box>
      )}
    </Box>
  );
}
