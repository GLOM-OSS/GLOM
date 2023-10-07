import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { UEMajor } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function ActionBar({
  disabled,
  majors,
  setActiveMajor,
  activeMajor,
  activeSemester,
  setActiveSemester,
}: {
  disabled: boolean;
  majors: UEMajor[];
  activeMajor?: UEMajor;
  setActiveMajor: (major: UEMajor | undefined) => void;
  activeSemester: number | undefined;
  setActiveSemester: (semester: number) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        marginTop: theme.spacing(1),
        display: 'grid',
        gridAutoFlow: 'column',
        justifyContent: 'start',
        columnGap: theme.spacing(2),
      }}
    >
      <FormControl>
        <InputLabel id="major">{formatMessage({ id: 'major' })}</InputLabel>
        <Select
          size="small"
          labelId="major"
          disabled={disabled}
          value={activeMajor?.major_id}
          onChange={(event) => {
            setActiveMajor(
              majors.find(({ major_id: mc }) => mc === event.target.value)
            );
          }}
          input={
            <OutlinedInput
              sx={{ minWidth: theme.spacing(20) }}
              label={formatMessage({ id: 'major' })}
            />
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
              },
            },
          }}
        >
          {majors.map(({ major_id: mc, major_name: mn }, index) => (
            <MenuItem key={index} value={mc}>
              {`${mn}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="semester">
          {formatMessage({ id: 'semester' })}
        </InputLabel>
        <Select
          size="small"
          labelId="semester"
          disabled={disabled}
          onChange={(event) => {
            setActiveSemester(Number(event.target.value));
          }}
          value={activeSemester}
          input={
            <OutlinedInput
              sx={{ minWidth: theme.spacing(20) }}
              label={formatMessage({ id: 'semester' })}
            />
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
              },
            },
          }}
        >
          {[...new Array(14)].map((_, index) => (
            <MenuItem key={index} value={index + 1}>
              {`${index + 1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
