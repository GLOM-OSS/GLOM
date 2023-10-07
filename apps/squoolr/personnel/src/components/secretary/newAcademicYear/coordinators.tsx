import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function CoordinatorsConfig({
  reuseCoordinatorsConfig,
  setReuseCoordinatorsConfig,
  isActive,
}: {
  reuseCoordinatorsConfig: boolean;
  setReuseCoordinatorsConfig: (val: boolean) => void;
  isActive: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box>
      {isActive && (
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
      )}
      {!isActive && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: theme.spacing(1),
          }}
        >
          <Typography sx={{ color: theme.common.placeholder }}>
            {`${formatMessage({ id: 'academicServiceConfigs' })} : `}
          </Typography>
          <Typography>
            {formatMessage({
              id: reuseCoordinatorsConfig ? 'reuseTemplate' : 'resetConfig',
            })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
