import {
    FormControl,
    FormControlLabel, Radio,
    RadioGroup
} from '@mui/material';
import { Box } from '@mui/system';
import { useIntl } from 'react-intl';

export default function CoordinatorsConfig({
  reuseCoordinatorsConfig,
  setReuseCoordinatorsConfig,
}: {
  reuseCoordinatorsConfig: boolean;
  setReuseCoordinatorsConfig: (val: boolean) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box>
      <FormControl>
        <RadioGroup
          value={reuseCoordinatorsConfig}
          onChange={(event) =>
            setReuseCoordinatorsConfig(event.target.value === 'true')
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
