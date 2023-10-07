import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export interface NewPersonnelInterface {
  reuse_configurators: boolean;
  reuse_registries: boolean;
  reuse_coordinators: boolean;
  reuse_teachers: boolean;
}

export default function PersonnelData({
  personnelConfig,
  personnelConfig: {
    reuse_registries: reuse_registry,
    reuse_coordinators,
    reuse_configurators: reuse_secretariat,
    reuse_teachers,
  },
  setPersonnelConfig,
  isActive,
}: {
  personnelConfig: NewPersonnelInterface;
  setPersonnelConfig: (config: NewPersonnelInterface) => void;
  isActive: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <>
      {isActive && (
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
              <FormLabel>{formatMessage({ id: 'secretariat' })}</FormLabel>
              <RadioGroup
                value={reuse_secretariat}
                onChange={(event) =>
                  setPersonnelConfig({
                    ...personnelConfig,
                    reuse_configurators: event.target.value === 'true',
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
              <FormLabel>{formatMessage({ id: 'registry' })}</FormLabel>
              <RadioGroup
                value={reuse_registry}
                onChange={(event) =>
                  setPersonnelConfig({
                    ...personnelConfig,
                    reuse_registries: event.target.value === 'true',
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
      )}
      {!isActive && (
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography sx={{ color: theme.common.placeholder }}>
              {`${formatMessage({ id: 'secretariat' })} : `}
            </Typography>
            <Typography>
              {formatMessage({
                id: reuse_secretariat ? 'reuseTemplate' : 'resetConfig',
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography sx={{ color: theme.common.placeholder }}>
              {`${formatMessage({ id: 'registry' })} : `}
            </Typography>
            <Typography>
              {formatMessage({
                id: reuse_registry ? 'reuseTemplate' : 'resetConfig',
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography sx={{ color: theme.common.placeholder }}>
              {`${formatMessage({ id: 'coordinators' })} : `}
            </Typography>
            <Typography>
              {formatMessage({
                id: reuse_coordinators ? 'reuseTemplate' : 'resetConfig',
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing(1),
            }}
          >
            <Typography sx={{ color: theme.common.placeholder }}>
              {`${formatMessage({ id: 'teachers' })} : `}
            </Typography>
            <Typography>
              {formatMessage({
                id: reuse_teachers ? 'reuseTemplate' : 'resetConfig',
              })}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
