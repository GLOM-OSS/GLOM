import { Box, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export interface NewAcademicYearInterface {
  academic_year_start_date: Date;
  academic_year_end_date: Date;
}

export default function AcademicYearData({
  handleSubmit,
  handleChange,
  isActive,
  initialAcademicYear,
  hasSubmit,
  submitDisabled,
  initialAcademicYear: { academic_year_end_date, academic_year_start_date },
}: {
  handleSubmit: (academicYear: NewAcademicYearInterface) => void;
  handleChange: (academicYear: NewAcademicYearInterface) => void;
  isActive: boolean;
  hasSubmit?: boolean;
  initialAcademicYear: NewAcademicYearInterface;
  submitDisabled: boolean;
}) {
  const { formatMessage, formatDate } = useIntl();

  const initialValues: NewAcademicYearInterface = initialAcademicYear;

  const validationSchema = Yup.object().shape({
    academic_year_start_date: Yup.date()
      .min(new Date())
      .required(formatMessage({ id: 'startDateGreaterThanNow' })),
    academic_year_end_date: Yup.date()
      .required()
      .min(
        Yup.ref('academic_year_start_date'),
        formatMessage({ id: 'endDateGreaterThanStart' })
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    handleChange(formik.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  return (
    <>
      {isActive && (
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(1),
            width: 'fit-content',
            justifyItems: 'end',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gap: theme.spacing(2),
              width: 'fit-content',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label={formatMessage({
                  id: 'academic_year_start_date',
                })}
                value={formik.values.academic_year_start_date}
                onChange={(newValue) => {
                  formik.setFieldValue('academic_year_start_date', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="primary"
                    size="medium"
                    error={
                      formik.touched.academic_year_start_date &&
                      Boolean(formik.errors.academic_year_start_date)
                    }
                    helperText={
                      formik.touched.academic_year_start_date &&
                      formik.errors.academic_year_start_date !== undefined &&
                      String(formik.errors.academic_year_start_date)
                    }
                    {...formik.getFieldProps('academic_year_start_date')}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label={formatMessage({
                  id: 'academic_year_end_date',
                })}
                value={formik.values.academic_year_end_date}
                onChange={(newValue) => {
                  formik.setFieldValue('academic_year_end_date', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="primary"
                    size="medium"
                    error={
                      formik.touched.academic_year_end_date &&
                      Boolean(formik.errors.academic_year_end_date)
                    }
                    helperText={
                      formik.touched.academic_year_end_date &&
                      formik.errors.academic_year_end_date !== undefined &&
                      String(formik.errors.academic_year_end_date)
                    }
                    {...formik.getFieldProps('academic_year_end_date')}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          {hasSubmit && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => formik.handleSubmit()}
              disabled={submitDisabled}
            >
              {formatMessage({ id: 'createAcademicYear' })}
            </Button>
          )}
        </Box>
      )}
      {!isActive && (
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography
              sx={{ color: theme.common.placeholder }}
            >{`${formatMessage({ id: 'startsOn' })} : `}</Typography>
            <Typography>
              {formatDate(academic_year_start_date, {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography
              sx={{ color: theme.common.placeholder }}
            >{`${formatMessage({ id: 'endsOn' })} : `}</Typography>
            <Typography>
              {formatDate(academic_year_end_date, {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
