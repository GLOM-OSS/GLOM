import { PhoneTextField } from '@glom/components';
import { CreateInquiryPayload } from '@glom/data-types';
import { useTheme } from '@glom/theme';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

interface ICreateContactUs extends CreateInquiryPayload {
  phone: string;
}

export default function ContactUs({
  open,
  closeDialog,
}: {
  open: boolean;
  closeDialog: () => void;
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialValues: ICreateContactUs = {
    email: '',
    phone: '',
    message: '',
    type: 'Default',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
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
      resetForm();
    },
  });

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={open}
      keepMounted
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
      onClose={() => {
        formik.resetForm();
        closeDialog();
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
        <Box sx={{ display: 'grid', rowGap: 0.5, justifyItems: 'center' }}>
          <Typography
            variant="h1"
            className="h1--mobile"
            sx={{ paddingBottom: 0 }}
          >
            {formatMessage({ id: 'contactUs' })}
          </Typography>
          <Typography
            variant="h4"
            className="h4--mobile"
            sx={{ color: theme.common.label, textAlign: 'center' }}
          >
            {formatMessage({ id: 'contactUsSubtitle' })}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{ padding: '0 16px 30px 16px', display: 'grid', rowGap: 2 }}
        onSubmit={formik.handleSubmit}
        component="form"
      >
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
          label={formatMessage({ id: 'message' })}
          placeholder={formatMessage({ id: 'writeYourMessageHere' })}
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
          Submit
        </Button>
      </Box>
    </Dialog>
  );
}
