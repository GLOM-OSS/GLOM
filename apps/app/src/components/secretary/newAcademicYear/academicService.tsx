import {
    FormControl,
    FormControlLabel, Radio,
    RadioGroup
} from '@mui/material';
import { Box } from '@mui/system';
import { useIntl } from 'react-intl';

export default function AcademicServiceConfig({
  reuseRegistryConfig,
  setReuseRegistryConfig,
}: {
  reuseRegistryConfig: boolean;
  setReuseRegistryConfig: (val: boolean) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box>
      <FormControl>
        <RadioGroup
          value={reuseRegistryConfig}
          onChange={(event) =>
            setReuseRegistryConfig(event.target.value === 'true')
          }
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={formatMessage({ id: 'resetConfig' })}
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={formatMessage({ id: 'reuseTemplate' })}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
