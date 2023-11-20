import { DialogTransition } from '@glom/components';
import {
  CreateStaffPayload,
  StaffEntity,
  StaffRole,
} from '@glom/data-types/squoolr';
import { useTheme } from '@glom/theme';
import { LocationOnOutlined } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  capitalize,
  debounce,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import parse from 'autosuggest-highlight/parse';
import { useFormik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

const autocompleteService = { current: null };

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

export default function AddStaffDialog({
  closeDialog,
  isDialogOpen,
  usage,
  staff,
}: {
  closeDialog: () => void;
  isDialogOpen: boolean;
  usage: Exclude<StaffRole, 'TEACHER' | 'COORDINATOR'>;
  staff?: StaffEntity;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const initialValues: CreateStaffPayload['payload'] = {
    role: 'CONFIGURATOR',
    email: staff ? staff.email : '',
    first_name: staff ? staff.first_name : '',
    last_name: staff ? staff.last_name : '',
    phone_number: staff ? staff.phone_number.split('+237')[1] : '',
    address: staff ? staff.address : '',
    birthdate: staff ? staff.birthdate : '',
    gender: staff ? staff.gender : 'Female',
    national_id_number: staff ? staff.national_id_number : '',
  };
  const validationSchema = Yup.object().shape({
    gender: Yup.string()
      .oneOf(['Male', 'Female'])
      .required(formatMessage({ id: 'required' })),
    email: Yup.string()
      .email()
      .required(formatMessage({ id: 'required' })),

    first_name: Yup.string().required(formatMessage({ id: 'required' })),
    last_name: Yup.string().required(formatMessage({ id: 'required' })),
    phone_number: Yup.string()
      .matches(
        /^(6[5-9]|2[3-7]|3[0-2])(\d{7})$/,
        formatMessage({ id: 'invalidPhonenumber' })
      )
      .required(formatMessage({ id: 'requiredField' })),
    address: Yup.string().required(formatMessage({ id: 'required' })),
    birthdate: Yup.date()
      .max(new Date(), formatMessage({ id: 'cannotBeGreaterThanToday' }))
      .required(formatMessage({ id: 'required' })),
    national_id_number: Yup.string()
      .matches(/^\d{9}$|^\d{12}$/, formatMessage({ id: 'nidValidLength' }))
      .required(formatMessage({ id: 'required' })),
  });

  //TODO: REMOVE THIS AND REPLACE WITH reactQuery own
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      const submitValue = {
        ...values,
        role: usage,
        phone_number: `+237${values.phone_number}`,
        ...(staff
          ? {
              ...(staff.annual_configurator_id
                ? { annual_configurator_id: staff.annual_configurator_id }
                : {}),
              ...(staff.annual_registry_id
                ? { annual_registry_id: staff.annual_registry_id }
                : {}),
            }
          : {}),
      };
      //TODO; call api here to create staff with data submitValue
      setTimeout(() => {
        setIsSubmitting(false);
        alert(JSON.stringify(submitValue));
        resetForm();
        close();
      }, 3000);
    },
  });

  function close() {
    formik.resetForm();
    closeDialog();
  }

  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const loaded = useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyDYFQ9bbgFmqBdn_llTxm4gfooXajGYOuE'}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!autocompleteService.current && (window as any).google) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const places = (window as any).google.maps?.places;
      if (places)
        autocompleteService.current = new places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={isDialogOpen}
      onClose={() => (isSubmitting ? null : close())}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>
        {formatMessage({
          id: `${staff ? 'edit' : 'add'}${capitalize(
            usage ? usage.toLowerCase() : ''
          )}`,
        })}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{ padding: '14px 0px 0px 0px', display: 'grid', rowGap: 2 }}
          onSubmit={formik.handleSubmit}
          component="form"
        >
          <TextField
            fullWidth
            required
            autoFocus
            size="small"
            label={formatMessage({ id: 'email' })}
            placeholder={formatMessage({ id: 'enterEmail' })}
            variant="outlined"
            type="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            {...formik.getFieldProps('email')}
            disabled={isSubmitting}
          />
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <TextField
              fullWidth
              required
              size="small"
              label={formatMessage({ id: 'firstName' })}
              placeholder={formatMessage({ id: 'firstName' })}
              variant="outlined"
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
              helperText={formik.touched.first_name && formik.errors.first_name}
              {...formik.getFieldProps('first_name')}
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              required
              size="small"
              label={formatMessage({ id: 'lastName' })}
              placeholder={formatMessage({ id: 'lastName' })}
              variant="outlined"
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
              helperText={formik.touched.last_name && formik.errors.last_name}
              {...formik.getFieldProps('last_name')}
              disabled={isSubmitting}
            />
          </Box>
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: 1,
                  paddingBottom: 1,
                },
              }}
            >
              <InputLabel>{formatMessage({ id: 'gender' })}</InputLabel>
              <Select
                size="small"
                label={formatMessage({ id: 'gender' })}
                {...formik.getFieldProps('gender')}
                disabled={isSubmitting}
                required
                //   disabled={isFetchingTeachers || isFetchingClassrooms}
              >
                {['Male', 'Female'].map((gender, index) => (
                  <MenuItem key={index} value={gender}>
                    {formatMessage({ id: gender.toLowerCase() })}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.gender && !!formik.errors.gender && (
                <FormHelperText sx={{ color: theme.palette.error.main }}>
                  {formik.errors.gender}
                </FormHelperText>
              )}
            </FormControl>
            <MobileDatePicker
              label={formatMessage({ id: 'birthdate' })}
              renderInput={(params) => <TextField {...params} size="small" />}
              value={formik.values.birthdate}
              disabled={isSubmitting}
              onChange={(value) =>
                formik.setFieldValue('birthdate', new Date(value).toISOString())
              }
              maxDate={new Date().toISOString()}
            />
          </Box>
          <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
            <TextField
              fullWidth
              required
              size="small"
              label={formatMessage({ id: 'nidNumber' })}
              placeholder={formatMessage({ id: 'nidNumber' })}
              variant="outlined"
              error={
                formik.touched.national_id_number &&
                Boolean(formik.errors.national_id_number)
              }
              helperText={
                formik.touched.national_id_number &&
                formik.errors.national_id_number
              }
              {...formik.getFieldProps('national_id_number')}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              label={formatMessage({ id: 'phoneNumber' })}
              placeholder={formatMessage({ id: 'phoneNumber' })}
              variant="outlined"
              error={
                formik.touched.phone_number &&
                Boolean(formik.errors.phone_number)
              }
              helperText={
                formik.touched.phone_number && formik.errors.phone_number
              }
              {...formik.getFieldProps('phone_number')}
            />
          </Box>

          <Autocomplete
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            disabled={isSubmitting}
            includeInputInList
            filterSelectedOptions
            size="small"
            {...formik.getFieldProps('address')}
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
              if (newValue === null) formik.setFieldValue('address', '');
              else formik.setFieldValue('address', newValue.description);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`${formatMessage({ id: 'address' })}`}
                required
                color="primary"
                variant="outlined"
                fullWidth
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            )}
            renderOption={(props, option) => {
              const matches =
                option.structured_formatting.main_text_matched_substrings || [];

              const parts = parse(
                option.structured_formatting.main_text,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                matches.map((match: any) => [
                  match.offset,
                  match.offset + match.length,
                ])
              );

              return (
                <li {...props}>
                  <Grid container alignItems="center">
                    <Grid item sx={{ display: 'flex', width: 44 }}>
                      <LocationOnOutlined sx={{ color: 'text.secondary' }} />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width: 'calc(100% - 44px)',
                        wordWrap: 'break-word',
                      }}
                    >
                      {parts.map((part, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            fontWeight: part.highlight ? 'bold' : 'regular',
                          }}
                        >
                          {part.text}
                        </Box>
                      ))}
                      <Typography variant="body2" color="text.secondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
          />
          <DialogActions
            sx={{
              justifyContent: 'center',
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: '20px',
              padding: '30px 0 0 0 !important',
            }}
          >
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => (isSubmitting ? null : close())}
              disabled={isSubmitting}
            >
              {formatMessage({ id: 'cancel' })}
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={
                isSubmitting ||
                (staff &&
                  staff.address === formik.values.address &&
                  staff.birthdate === formik.values.birthdate &&
                  staff.email === formik.values.email &&
                  staff.first_name === formik.values.first_name &&
                  staff.gender === formik.values.gender &&
                  staff.last_name === formik.values.last_name &&
                  staff.national_id_number ===
                    formik.values.national_id_number &&
                  staff.phone_number.split('+237')[1] ===
                    formik.values.phone_number)
              }
              type="submit"
              startIcon={
                isSubmitting && <CircularProgress color="primary" size={18} />
              }
            >
              {formatMessage({ id: staff ? 'save' : 'create' })}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
