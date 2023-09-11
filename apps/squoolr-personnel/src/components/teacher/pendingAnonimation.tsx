import {
  Box,
  Button,
  Chip,
  lighten,
  TextField,
  Typography,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { MobileDatePicker } from '@mui/x-date-pickers';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function PendingAnonimation() {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: theme.spacing(2),
        alignSelf: 'start',
        marginTop: theme.spacing(4),
        justifyItems: 'start',
      }}
    >
      <Typography>
        {formatMessage({ id: 'pendingAnonimationMessage' })}
      </Typography>
      <Chip
        label={formatMessage({ id: 'pendingAnomimation' })}
        sx={{ backgroundColor: lighten(theme.palette.error.main, 0.6) }}
      />
    </Box>
  );
}

export function GetResitDate({
  publishResitDate,
}: {
  publishResitDate: (examination_date: Date) => void;
}) {
  const { formatMessage } = useIntl();

  const initialValues: { examination_date: Date } = {
    examination_date: new Date(),
  };
  const validationSchema = Yup.object().shape({
    examination_date: Yup.date()
      .required()
      .min(new Date(), formatMessage({ id: 'examDateGreaterThanToday' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      publishResitDate(values.examination_date);
      resetForm();
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: theme.spacing(2),
        alignSelf: 'start',
        marginTop: theme.spacing(4),
      }}
    >
      <Typography>{formatMessage({ id: 'getResitDateMessage' })}</Typography>
      <Box
        component={'form'}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          justifyItems: 'start',
          columnGap: theme.spacing(2),
        }}
        onSubmit={formik.handleSubmit}
      >
        <MobileDatePicker
          label={formatMessage({
            id: 'examinationDate',
          })}
          value={formik.values.examination_date}
          onChange={(newValue) => {
            formik.setFieldValue('examination_date', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              color="primary"
              size="small"
              error={
                formik.touched.examination_date &&
                Boolean(formik.errors.examination_date)
              }
              helperText={
                formik.touched.examination_date &&
                formik.errors.examination_date !== undefined &&
                String(formik.errors.examination_date)
              }
              {...formik.getFieldProps('examination_date')}
            />
          )}
        />
        <Button variant="contained" color="primary" type="submit">
          {formatMessage({ id: 'publishExamDate' })}
        </Button>
      </Box>
    </Box>
  );
}
