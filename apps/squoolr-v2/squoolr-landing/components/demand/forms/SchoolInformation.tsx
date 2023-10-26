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

export type ISchoolInformation = Omit<
  SubmitSchoolDemandPayload['school'],
  'lead_funnel' | 'referral_code'
>;

export default function SchoolInformation({
  data,
  onNext,
  onPrev,
}: {
  data: ISchoolInformation;
  onNext: (val: ISchoolInformation) => void;
  onPrev: () => void;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const validationSchema = Yup.object().shape({
    school_name: Yup.string().required(formatMessage({ id: 'requiredField' })),
    school_acronym: Yup.string()
      .matches(/^[A-Z0-9-]*$/gm, formatMessage({ id: 'onlyAcceptAccronym' }))
      .required(formatMessage({ id: 'requiredField' })),
    school_phone_number: Yup.string()
      .matches(
        /^(6[5-9]|2[3-7]|3[0-2])(\d{7})$/,
        formatMessage({ id: 'invalidPhonenumber' })
      )
      .required(formatMessage({ id: 'requiredField' })),
    school_email: Yup.string()
      .email()
      .required(formatMessage({ id: 'requiredField' })),
    initial_year_starts_at: Yup.date().required(),
    initial_year_ends_at: Yup.date()
      .required()
      .min(
        Yup.ref('initial_year_starts_at'),
        formatMessage({ id: 'endDateGreaterThanStart' })
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
          label={formatMessage({ id: 'institutionName' })}
          placeholder={formatMessage({ id: 'institutionName' })}
          variant="outlined"
          error={
            formik.touched.school_name && Boolean(formik.errors.school_name)
          }
          helperText={formik.touched.school_name && formik.errors.school_name}
          {...formik.getFieldProps('school_name')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'schoolAcronym' })}
          placeholder={formatMessage({ id: 'schoolAcronym' })}
          variant="outlined"
          error={
            formik.touched.school_acronym &&
            Boolean(formik.errors.school_acronym)
          }
          helperText={
            formik.touched.school_acronym && formik.errors.school_acronym
          }
          {...formik.getFieldProps('school_acronym')}
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
          label={formatMessage({ id: 'institutionPhoneNumber' })}
          placeholder={formatMessage({ id: 'institutionPhoneNumber' })}
          variant="outlined"
          error={
            formik.touched.school_phone_number &&
            Boolean(formik.errors.school_phone_number)
          }
          helperText={
            formik.touched.school_phone_number &&
            formik.errors.school_phone_number
          }
          {...formik.getFieldProps('school_phone_number')}
        />
        <TextField
          size="small"
          fullWidth
          required
          label={formatMessage({ id: 'schoolEmail' })}
          placeholder={formatMessage({ id: 'schoolEmail' })}
          variant="outlined"
          type="email"
          error={
            formik.touched.school_email && Boolean(formik.errors.school_email)
          }
          helperText={formik.touched.school_email && formik.errors.school_email}
          {...formik.getFieldProps('school_email')}
        />
        <MobileDatePicker
          label={formatMessage({ id: 'initialAcademicYearStartDate' })}
          renderInput={(params) => <TextField {...params} size="small" />}
          value={dayjs(formik.values.initial_year_starts_at)}
          onChange={(value) =>
            formik.setFieldValue(
              'initial_year_starts_at',
              new Date(dayjs(value).format()).toISOString()
            )
          }
        />
        <MobileDatePicker
          label={formatMessage({ id: 'estimatedInitialAcademicYearEndDate' })}
          renderInput={(params) => <TextField {...params} size="small" />}
          value={dayjs(formik.values.initial_year_ends_at)}
          onChange={(value) =>
            formik.setFieldValue(
              'initial_year_ends_at',
              new Date(dayjs(value).format()).toISOString()
            )
          }
        />
      </Box>
      <Box
        sx={{
          justifySelf: 'end',
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 4,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          color="inherit"
          onClick={onPrev}
        >
          {formatMessage({ id: 'back' })}
        </Button>
        <Button type="submit" variant="contained" size="large" color="primary">
          {formatMessage({ id: 'next' })}
        </Button>
      </Box>
    </Box>
  );
}
