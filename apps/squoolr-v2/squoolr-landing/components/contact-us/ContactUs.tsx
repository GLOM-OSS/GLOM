import { PhoneTextField } from '@glom/components';
import { useSubmitInquiry } from '@glom/data-access/squoolr';
import { CreateInquiryPayload } from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function ContactUs({
  open,
  closeDialog,
  usage = 'Default',
}: {
  open: boolean;
  closeDialog: () => void;
  usage?: CreateInquiryPayload['type'];
}) {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const initialValues: CreateInquiryPayload = {
    email: '',
    phone: '',
    message: usage === 'Default' ? '' : 'earlyAccessMessage',
    name: '',
    type: usage,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    name: Yup.string().required(formatMessage({ id: 'requiredField' })),
    phone: Yup.string().required(formatMessage({ id: 'requiredField' })),
    message: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const { mutate: submitInquiry, isPending: isSubmitting } = useSubmitInquiry();

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      submitInquiry(values, {
        onSuccess() {
          closeDialog();
          resetForm();
        },
      });
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
            sx={{ paddingBottom: 0, textAlign: 'center' }}
          >
            {formatMessage({
              id: usage === 'Default' ? 'contactUs' : 'getEarlyAccessNow',
            })}
          </Typography>
          <Typography
            variant="h4"
            className="h4--mobile"
            sx={{ color: theme.common.label, textAlign: 'center' }}
          >
            {formatMessage({
              id:
                usage === 'Default'
                  ? `contactUsSubtitle`
                  : 'earlyAccessSubtitle',
            })}
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
          label={formatMessage({ id: 'fullname' })}
          placeholder={formatMessage({ id: 'fullname' })}
          variant="outlined"
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          {...formik.getFieldProps('name')}
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

        {usage === 'Default' && (
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
        )}

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
    </Dialog>
  );
}
