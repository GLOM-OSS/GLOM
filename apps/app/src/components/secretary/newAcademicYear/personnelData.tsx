import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Box } from '@mui/system';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export interface NewPersonnelInterface {
  reuse_registry: boolean;
  reuse_academic_service: boolean;
  reuse_coordinators: boolean;
  reuse_teachers: boolean;
}

export default function PersonnelData({
  personnelConfig,
  personnelConfig: {
    reuse_academic_service,
    reuse_coordinators,
    reuse_registry,
    reuse_teachers,
  },
  setPersonnelConfig,
}: {
  personnelConfig: NewPersonnelInterface;
  setPersonnelConfig: (config: NewPersonnelInterface) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ display: 'grid', gap: theme.spacing(4) }}>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: theme.spacing(2),
          width: 'fit-content',
        }}
      >
        <FormControl>
          <FormLabel>{formatMessage({ id: 'registry' })}</FormLabel>
          <RadioGroup
            value={reuse_registry}
            onChange={(event) =>
              setPersonnelConfig({
                ...personnelConfig,
                reuse_registry: event.target.value === 'true',
              })
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
        <FormControl>
          <FormLabel>{formatMessage({ id: 'academicService' })}</FormLabel>
          <RadioGroup
            value={reuse_academic_service}
            onChange={(event) =>
              setPersonnelConfig({
                ...personnelConfig,
                reuse_academic_service: event.target.value === 'true',
              })
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
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: theme.spacing(2),
          width: 'fit-content',
        }}
      >
        <FormControl>
          <FormLabel>{formatMessage({ id: 'coordinators' })}</FormLabel>
          <RadioGroup
            value={reuse_coordinators}
            onChange={(event) =>
              setPersonnelConfig({
                ...personnelConfig,
                reuse_coordinators: event.target.value === 'true',
              })
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
        <FormControl>
          <FormLabel>{formatMessage({ id: 'teachers' })}</FormLabel>
          <RadioGroup
            value={reuse_teachers}
            onChange={(event) =>
              setPersonnelConfig({
                ...personnelConfig,
                reuse_teachers: event.target.value === 'true',
              })
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
    </Box>
  );
}
