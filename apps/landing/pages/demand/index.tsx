import { ContentCopyRounded, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  lighten,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { makeNewDemand } from '@squoolr/api-services';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function Demand() {
  const { formatMessage, formatDate } = useIntl();
  const [step, setStep] = useState<number>(1);
  const stepperTitle: string[] = [
    'informationAboutYou',
    'informationAboutTheSchool',
    'validation',
  ];
  const adminInitialValues: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    birthdate: Date;
    gender: 'Male' | 'Female';
    national_id_number: string;
    password: string;
    confirm_password: string;
  } = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birthdate: new Date(),
    gender: 'Male',
    national_id_number: '',
    password: '',
    confirm_password: '',
  };

  const schoolInitialValues: {
    institute_name: string;
    institute_short_name: string;
    institute_email: string;
    institute_phone: string;
    initial_academic_year_start_date: Date;
    initial_academic_year_end_date: Date;
  } = {
    institute_email: '',
    institute_short_name: '',
    institute_name: '',
    institute_phone: '',
    initial_academic_year_end_date: new Date(),
    initial_academic_year_start_date: new Date(),
  };

  const schoolValidationSchema = Yup.object().shape({
    institute_email: Yup.string().required(),
    institute_name: Yup.string().required(),
    institute_phone: Yup.string().required(),
    initial_academic_year_start_date: Yup.date().min(new Date()).required(),
    initial_academic_year_end_date: Yup.date()
      .required()
      .min(
        Yup.ref('initial_academic_year_start_date'),
        formatMessage({ id: 'endDateGreaterThanStart' })
      ),
  });
  const adminValidationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone_number: Yup.string().required(),
    birthdate: Yup.date()
      .max(new Date(), formatMessage({ id: 'areYouTimeTraveller' }))
      .required(),
    gender: Yup.string().oneOf(['Male', 'Female']).required(),
    national_id_number: Yup.string().required(),
    password: Yup.string().required(),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null]),
  });

  const adminFormik = useFormik({
    initialValues: adminInitialValues,
    validationSchema: adminValidationSchema,
    onSubmit: () => {
      setStep(2);
    },
  });

  const schoolFormik = useFormik({
    initialValues: schoolInitialValues,
    validationSchema: schoolValidationSchema,
    onSubmit: () => {
      setStep(3);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<useNotification[]>();
  const [schoolCode, setSchoolCode] = useState<string>();

  const submitDemand = () => {
    setIsSubmitting(true);
    if (notifications)
      notifications.forEach((notification) => notification.dismiss());
    const notif = new useNotification();
    notif.notify({ render: formatMessage({ id: 'submittingDemand' }) });
    if (notifications) setNotifications([...notifications, notif]);
    else setNotifications([notif]);

    const {
      initial_academic_year_start_date: initial_year_starts_at,
      initial_academic_year_end_date: initial_year_ends_at,
      institute_email: school_email,
      institute_name: school_name,
      institute_phone: school_phone_number,
      institute_short_name: school_acronym,
    } = schoolFormik.values;
    const { birthdate, confirm_password, phone_number, ...person } =
      adminFormik.values;
    makeNewDemand({
      personnel: {
        birthdate: birthdate,
        phone_number: phone_number,
        ...person,
      },
      school: {
        initial_year_starts_at,
        initial_year_ends_at,
        school_acronym,
        school_email,
        school_name,
        school_phone_number,
      },
    })
      .then((schoolCode) => {
        notif.update({ render: 'demandSuccessfull' });
        setSchoolCode(schoolCode);
        schoolFormik.resetForm();
        adminFormik.resetForm();
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={submitDemand}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'createDemandFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const { push } = useRouter();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing(11.25),
        paddingBottom: theme.spacing(6.25),
        display: 'grid',
        height: '100%',
        gridTemplateRows: 'auto auto 1fr',
        color: theme.common.titleActive,
      }}
    >
      <Box sx={{ paddingBottom: theme.spacing(6.25) }}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          {formatMessage({ id: 'schoolCreation' })}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {formatMessage({ id: 'schoolCreationSubtitle' })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: theme.spacing(3),
          marginBottom: '30px',
        }}
      >
        {stepperTitle.map((title, index) => (
          <Box key={index}>
            <Typography
              sx={{
                color:
                  step >= index + 1
                    ? theme.palette.primary.main
                    : theme.common.placeholder,
                marginBottom: theme.spacing(1),
                transition: '0.2s',
              }}
            >
              {`${index + 1}. ${formatMessage({ id: title })}`}
            </Typography>
            <Box
              sx={{ backgroundColor: theme.common.placeholder, height: '5px' }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  height: '5px',
                  width: step >= index + 1 ? '100%' : 0,
                  transition: '0.2s',
                }}
              ></Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          border: `1px solid ${theme.common.placeholder}`,
          borderRadius: '10px',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Scrollbars>
          <Box
            sx={{
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
              marginTop: theme.spacing(2),
            }}
          >
            <Box
              component={Collapse}
              in={step === 1}
              timeout={500}
              onSubmit={adminFormik.handleSubmit}
              sx={{
                height: step === 1 ? '100% !important' : 0,
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                '& .MuiCollapse-wrapper>.MuiCollapse-wrapperInner': {
                  height: step === 1 ? '100% !important' : 0,
                  display: 'grid',
                  rowGap: theme.spacing(3),
                  alignItems: 'start',
                },
              }}
            >
              <TextField
                disabled={isSubmitting}
                autoFocus
                placeholder={formatMessage({ id: 'firstName' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'first_name' })}
                error={
                  adminFormik.touched.first_name &&
                  Boolean(adminFormik.errors.first_name)
                }
                helperText={
                  adminFormik.touched.first_name &&
                  adminFormik.errors.first_name
                }
                {...adminFormik.getFieldProps('first_name')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'lastName' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'last_name' })}
                error={
                  adminFormik.touched.last_name &&
                  Boolean(adminFormik.errors.last_name)
                }
                helperText={
                  adminFormik.touched.last_name && adminFormik.errors.last_name
                }
                {...adminFormik.getFieldProps('last_name')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'email' })}
                fullWidth
                required
                type="email"
                color="primary"
                size="medium"
                label={formatMessage({ id: 'email' })}
                error={
                  adminFormik.touched.email && Boolean(adminFormik.errors.email)
                }
                helperText={
                  adminFormik.touched.email && adminFormik.errors.email
                }
                {...adminFormik.getFieldProps('email')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'phone_number' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'phone_number' })}
                error={
                  adminFormik.touched.phone_number &&
                  Boolean(adminFormik.errors.phone_number)
                }
                helperText={
                  adminFormik.touched.phone_number &&
                  adminFormik.errors.phone_number
                }
                {...adminFormik.getFieldProps('phone_number')}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label={formatMessage({ id: 'birthdate' })}
                  value={adminFormik.values.birthdate}
                  onChange={(newValue) => {
                    adminFormik.setFieldValue('birthdate', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={isSubmitting}
                      {...params}
                      color="primary"
                      size="medium"
                      fullWidth
                      error={
                        adminFormik.touched.birthdate &&
                        Boolean(adminFormik.errors.birthdate)
                      }
                      helperText={
                        adminFormik.touched.birthdate &&
                        adminFormik.errors.birthdate !== undefined &&
                        String(adminFormik.errors.birthdate)
                      }
                      {...adminFormik.getFieldProps('birthdate')}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'gender' })}
                fullWidth
                required
                select
                color="primary"
                size="medium"
                label={formatMessage({ id: 'gender' })}
                error={
                  adminFormik.touched.gender &&
                  Boolean(adminFormik.errors.gender)
                }
                helperText={
                  adminFormik.touched.gender && adminFormik.errors.gender
                }
                {...adminFormik.getFieldProps('gender')}
              >
                {['Male', 'Female'].map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {formatMessage({ id: option })}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'national_id_number' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'national_id_number' })}
                error={
                  adminFormik.touched.national_id_number &&
                  Boolean(adminFormik.errors.national_id_number)
                }
                helperText={
                  adminFormik.touched.national_id_number &&
                  adminFormik.errors.national_id_number
                }
                {...adminFormik.getFieldProps('national_id_number')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'password' })}
                fullWidth
                required
                color="primary"
                size="medium"
                type="password"
                label={formatMessage({ id: 'password' })}
                error={
                  adminFormik.touched.password &&
                  Boolean(adminFormik.errors.password)
                }
                helperText={
                  adminFormik.touched.password && adminFormik.errors.password
                }
                {...adminFormik.getFieldProps('password')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'confirm_password' })}
                fullWidth
                required
                color="primary"
                size="medium"
                type="password"
                label={formatMessage({ id: 'confirm_password' })}
                error={
                  adminFormik.touched.confirm_password &&
                  Boolean(adminFormik.errors.confirm_password)
                }
                helperText={
                  adminFormik.touched.confirm_password &&
                  adminFormik.errors.confirm_password
                }
                {...adminFormik.getFieldProps('confirm_password')}
              />
              <Button
                sx={{ justifySelf: 'end' }}
                onClick={adminFormik.submitForm}
                variant="contained"
                color="primary"
                disabled={
                  isSubmitting ||
                  Object.keys(adminFormik.errors).length > 0 ||
                  Object.keys(adminFormik.touched).length === 0
                }
              >
                {formatMessage({ id: 'next' })}
              </Button>
            </Box>
            <Box
              component={Collapse}
              in={step === 2}
              timeout={500}
              sx={{
                height: step === 2 ? '100% !important' : 0,
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                '& >.MuiCollapse-wrapper>.MuiCollapse-wrapperInner': {
                  height: step === 2 ? '100% !important' : 0,
                  display: 'grid',
                  rowGap: theme.spacing(3),
                  alignItems: 'start',
                },
              }}
            >
              <TextField
                disabled={isSubmitting}
                autoFocus
                placeholder={formatMessage({ id: 'institute_name' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'institute_name' })}
                error={
                  schoolFormik.touched.institute_name &&
                  Boolean(schoolFormik.errors.institute_name)
                }
                helperText={
                  schoolFormik.touched.institute_name &&
                  schoolFormik.errors.institute_name
                }
                {...schoolFormik.getFieldProps('institute_name')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'institute_short_name' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'institute_short_name' })}
                error={
                  schoolFormik.touched.institute_short_name &&
                  Boolean(schoolFormik.errors.institute_short_name)
                }
                helperText={
                  schoolFormik.touched.institute_short_name &&
                  schoolFormik.errors.institute_short_name
                }
                {...schoolFormik.getFieldProps('institute_short_name')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'institute_email' })}
                fullWidth
                required
                color="primary"
                size="medium"
                type="email"
                label={formatMessage({ id: 'institute_email' })}
                error={
                  schoolFormik.touched.institute_email &&
                  Boolean(schoolFormik.errors.institute_email)
                }
                helperText={
                  schoolFormik.touched.institute_email &&
                  schoolFormik.errors.institute_email
                }
                {...schoolFormik.getFieldProps('institute_email')}
              />
              <TextField
                disabled={isSubmitting}
                placeholder={formatMessage({ id: 'institute_phone' })}
                fullWidth
                required
                color="primary"
                size="medium"
                label={formatMessage({ id: 'institute_phone' })}
                error={
                  schoolFormik.touched.institute_phone &&
                  Boolean(schoolFormik.errors.institute_phone)
                }
                helperText={
                  schoolFormik.touched.institute_phone &&
                  schoolFormik.errors.institute_phone
                }
                {...schoolFormik.getFieldProps('institute_phone')}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label={formatMessage({
                    id: 'initial_academic_year_start_date',
                  })}
                  value={schoolFormik.values.initial_academic_year_start_date}
                  onChange={(newValue) => {
                    schoolFormik.setFieldValue(
                      'initial_academic_year_start_date',
                      newValue
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={isSubmitting}
                      {...params}
                      color="primary"
                      size="medium"
                      fullWidth
                      error={
                        schoolFormik.touched.initial_academic_year_start_date &&
                        Boolean(
                          schoolFormik.errors.initial_academic_year_start_date
                        )
                      }
                      helperText={
                        schoolFormik.touched.initial_academic_year_start_date &&
                        schoolFormik.errors.initial_academic_year_start_date !==
                          undefined &&
                        String(
                          schoolFormik.errors.initial_academic_year_start_date
                        )
                      }
                      {...schoolFormik.getFieldProps(
                        'initial_academic_year_start_date'
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label={formatMessage({
                    id: 'initial_academic_year_end_date',
                  })}
                  value={schoolFormik.values.initial_academic_year_end_date}
                  onChange={(newValue) => {
                    schoolFormik.setFieldValue(
                      'initial_academic_year_end_date',
                      newValue
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={isSubmitting}
                      {...params}
                      color="primary"
                      size="medium"
                      fullWidth
                      error={
                        schoolFormik.touched.initial_academic_year_end_date &&
                        Boolean(
                          schoolFormik.errors.initial_academic_year_end_date
                        )
                      }
                      helperText={
                        schoolFormik.touched.initial_academic_year_end_date &&
                        schoolFormik.errors.initial_academic_year_end_date !==
                          undefined &&
                        String(
                          schoolFormik.errors.initial_academic_year_end_date
                        )
                      }
                      {...schoolFormik.getFieldProps(
                        'initial_academic_year_end_date'
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
              <Box
                sx={{
                  justifySelf: 'end',
                  display: 'grid',
                  gridAutoFlow: 'column',
                  columnGap: theme.spacing(2),
                }}
              >
                <Button
                  onClick={() => setStep(1)}
                  variant="text"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {formatMessage({ id: 'back' })}
                </Button>
                <Button
                  onClick={schoolFormik.submitForm}
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting ||
                    Object.keys(schoolFormik.errors).length > 0 ||
                    Object.keys(schoolFormik.touched).length === 0
                  }
                >
                  {formatMessage({ id: 'next' })}
                </Button>
              </Box>
            </Box>
            <Box
              component={Collapse}
              in={step === 3}
              timeout={500}
              sx={{
                height: step === 3 ? '100% !important' : 0,
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                '& >.MuiCollapse-wrapper>.MuiCollapse-wrapperInner': {
                  height: step === 3 ? '100% !important' : 0,
                  display: 'grid',
                  rowGap: theme.spacing(3),
                  alignItems: 'start',
                },
              }}
            >
              {!isSubmitting && Boolean(schoolCode) ? (
                <Box sx={{ display: 'grid', justifyItems: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {formatMessage({ id: 'creationSuccess' })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      padding: `${theme.spacing(1)} 0`,
                      textAlign: 'center',
                    }}
                  >
                    {formatMessage({ id: 'creationSuccessMessage1' })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      padding: `${theme.spacing(1)} 0`,
                      textAlign: 'center',
                    }}
                  >
                    {formatMessage({ id: 'creationSuccessMessage2' })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      padding: `${theme.spacing(1)} 0`,
                      textAlign: 'center',
                      paddingBottom: 0,
                    }}
                  >
                    {formatMessage({ id: 'creationSuccessMessage3' })}
                  </Typography>
                  <Box
                    sx={{
                      padding: theme.spacing(3),
                      display: 'grid',
                      gridTemplateColumns: 'auto auto 1fr',
                      columnGap: theme.spacing(1),
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 400 }}>
                      {formatMessage({ id: 'code' })}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {schoolCode}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(schoolCode);
                        const notif = new useNotification();
                        notif.notify({
                          render: formatMessage({ id: 'copyingCode' }),
                        });
                        notif.update({
                          render: formatMessage({ id: 'codeCopied' }),
                        });
                      }}
                    >
                      <Tooltip arrow title={formatMessage({ id: 'copy' })}>
                        <ContentCopyRounded
                          sx={{
                            color: theme.common.titleActive,
                            fontSize: '20px',
                          }}
                        />
                      </Tooltip>
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    onClick={() => push(`/demand-status/${schoolCode}`)}
                  >
                    {formatMessage({ id: 'verifyStatus' })}
                  </Button>
                </Box>
              ) : (
                <>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatMessage({ id: 'informationAboutYou' })}
                    </Typography>
                    {Object.keys(adminFormik.values).map(
                      (key, index) =>
                        index < Object.keys(adminFormik.values).length - 2 && (
                          <Box
                            key={index}
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'auto 1fr',
                              columnGap: theme.spacing(1),
                              padding: theme.spacing(0.5),
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: theme.common.placeholder }}
                            >
                              {`${formatMessage({ id: key })} :`}
                            </Typography>
                            <Typography
                              variant="body2"
                              // sx={{ color: theme.common.placeholder }}
                            >
                              {key !== 'birthdate'
                                ? key === 'gender'
                                  ? formatMessage({
                                      id: adminFormik.values.gender,
                                    })
                                  : adminFormik.values[key]
                                : formatDate(
                                    new Date(adminFormik.values.birthdate),
                                    {
                                      year: 'numeric',
                                      month: 'long',
                                      day: '2-digit',
                                    }
                                  )}
                            </Typography>
                          </Box>
                        )
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatMessage({ id: 'informationAboutTheSchool' })}
                    </Typography>
                    {Object.keys(schoolFormik.values).map((key, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                          columnGap: theme.spacing(1),
                          padding: theme.spacing(0.5),
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: theme.common.placeholder }}
                        >
                          {`${formatMessage({ id: key })} :`}
                        </Typography>
                        <Typography
                          variant="body2"
                          // sx={{ color: theme.common.placeholder }}
                        >
                          {!key.includes('date')
                            ? schoolFormik.values[key]
                            : formatDate(new Date(schoolFormik.values[key]), {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit',
                              })}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridAutoFlow: 'column',
                      columnGap: theme.spacing(2),
                      justifySelf: 'end',
                    }}
                  >
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => setStep(2)}
                      disabled={isSubmitting}
                    >
                      {formatMessage({ id: 'back' })}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitDemand}
                      disabled={
                        isSubmitting ||
                        Object.keys(adminFormik.errors).length > 0 ||
                        Object.keys(adminFormik.touched).length === 0 ||
                        Object.keys(schoolFormik.errors).length > 0 ||
                        Object.keys(schoolFormik.touched).length === 0
                      }
                    >
                      {formatMessage({ id: 'submit' })}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Scrollbars>
        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.9),
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', padding: 1 }}>
            <Image
              src="/demand_illustration.png"
              alt={formatMessage({ id: 'skyRocketYourSchool' })}
              height="450%"
              width="450%"
            />
            <Typography variant="h5">
              {formatMessage({ id: 'getReadyForNewAdventure' })}
            </Typography>
            <Typography variant="h2">
              {formatMessage({ id: 'Squoolr' })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
