import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { CreateWeightingSystem, Cycle } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function SelectWeightingSystem({
  isDataLoading,
  activeCycleId: cycle_id,
  handleSubmit,
  cycles,
}: {
  isDataLoading: boolean;
  activeCycleId: string;
  cycles: Cycle[];
  handleSubmit: (values: CreateWeightingSystem) => void;
}) {
  const { formatMessage } = useIntl();

  const initialValues: { cycle_id: string; weighting_system?: number } = {
    cycle_id,
    weighting_system: undefined,
  };
  const validationSchema = Yup.object().shape({
    cycle_id: Yup.string().required(formatMessage({ id: 'required' })),
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
        <TextField
          select
          placeholder={formatMessage({ id: 'cycle' })}
          label={formatMessage({ id: 'cycle' })}
          fullWidth
          required
          color="primary"
          disabled={isDataLoading}
          {...formik.getFieldProps('cycle_id')}
          error={formik.touched.cycle_id && Boolean(formik.errors.cycle_id)}
          helperText={formik.touched.cycle_id && formik.errors.cycle_id}
        >
          {cycles.map(
            ({ cycle_id, cycle_name, number_of_years: noy }, index) => (
              <MenuItem key={index} value={cycle_id}>
                {`${cycle_name}(${noy} ${formatMessage({ id: 'years' })})`}
              </MenuItem>
            )
          )}
        </TextField>

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
