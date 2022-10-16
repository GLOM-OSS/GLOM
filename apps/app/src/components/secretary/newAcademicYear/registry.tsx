import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function RegistryConfig({
  reuseRegistryConfig,
  setReuseRegistryConfig,
  isActive,
}: {
  reuseRegistryConfig: boolean;
  setReuseRegistryConfig: (val: boolean) => void;
  isActive: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box>
      {isActive && (
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
              id: reuseRegistryConfig ? 'reuseTemplate' : 'resetConfig',
            })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
