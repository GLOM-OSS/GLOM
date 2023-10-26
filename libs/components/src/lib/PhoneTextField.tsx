import { Box, Typography } from '@mui/material';
import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { CSSProperties } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface IAddressFormik<T> {
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  setFieldValue: (field: string, value: unknown) => void;
  getFieldProps: (field: string) => FieldInputProps<string>;
}

export function PhoneTextField<T>({
  formik,
  field,
  style,
  placeholder = 'Ex: +237 6xx xxx xxx',
}: {
  field: keyof T;
  placeholder?: string;
  style?: CSSProperties;
  formik: IAddressFormik<T>;
}) {
  return (
    <Box sx={{ display: 'grid', gap: '3px' }}>
      <PhoneInput
        inputProps={{
          required: true,
          placeholder: placeholder,
          ...formik.getFieldProps(field as string),
        }}
        isValid={!formik.errors[field]}
        inputStyle={{ width: 'inherit', ...style }}
        value={formik.values[field] as string}
        defaultErrorMessage={formik.errors[field] as string}
      />
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 300,
          lineHeight: 1.66,
          textAlign: 'left',
          margin: '3px 14px 0 14px',
          color: '#DD0303',
        }}
      >
        {formik.errors[field] as string}
      </Typography>
    </Box>
  );
}
