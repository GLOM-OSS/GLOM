import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { CreateWeightingSystem } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function SelectWeightingSystem({
  isDataLoading,
  handleSubmit,
}: {
  isDataLoading: boolean;
  handleSubmit: (values: CreateWeightingSystem) => void;
}) {
  const { formatMessage } = useIntl();

  const initialValues: { weighting_system?: number } = {
    weighting_system: undefined,
  };
  const validationSchema = Yup.object().shape({
    weighting_system: Yup.number()
      .required(formatMessage({ id: 'required' }))
      .max(10, formatMessage({ id: 'lowerOrEqual10' }))
      .min(1, formatMessage({ id: 'greaterOrEqual1' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values as CreateWeightingSystem);
      resetForm();
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        rowGap: theme.spacing(3),
      }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {formatMessage({ id: 'selectAWeightingSystem' })}
      </Typography>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: theme.spacing(2) }}
      >
        <FormControl>
          <InputLabel id="weightingSystem">
            {formatMessage({ id: 'weightingSystem' })}
          </InputLabel>
          <Select
            labelId="weightingSystem"
            {...formik.getFieldProps('weighting_system')}
            input={
              <OutlinedInput label={formatMessage({ id: 'weightingSystem' })} />
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                },
              },
            }}
          >
            {[...new Array(10)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isDataLoading}
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          {formatMessage({ id: 'save' })}
        </Button>
      </Box>
    </Box>
  );
}
