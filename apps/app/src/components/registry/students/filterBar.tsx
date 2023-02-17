import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { Classroom, UEMajor } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function FilterBar({
  disabled,
  majors,
  setActiveMajor,
  activeMajor,
  classrooms,
  activeClassroom,
  setActiveClassroom,
  handleImport,
}: {
  disabled: boolean;
  majors: UEMajor[];
  activeMajor?: UEMajor;
  setActiveMajor: (major: UEMajor) => void;
  classrooms: Classroom[];
  activeClassroom?: string;
  setActiveClassroom: (classroom_acronym?: string) => void;
  handleImport: () => void;
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
            const newMajor = majors.find(
              ({ major_id: mc }) => mc === event.target.value
            );
            if (newMajor) setActiveMajor(newMajor);
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
          {majors.map(({ major_id: m_id, major_name: mn }, index) => (
            <MenuItem key={index} value={m_id}>
              {`${mn}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="classroom">
          {formatMessage({ id: 'classroom' })}
        </InputLabel>
        <Select
          size="small"
          labelId="classroom"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.value) setActiveClassroom(event.target.value);
            else setActiveClassroom(undefined);
          }}
          value={activeClassroom}
          input={
            <OutlinedInput
              sx={{ minWidth: theme.spacing(20) }}
              label={formatMessage({ id: 'classroom' })}
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
          <MenuItem value={undefined}>{formatMessage({ id: 'all' })}</MenuItem>
          {classrooms.map(
            ({ classroom_acronym: ca, classroom_code: cc }, index) => (
              <MenuItem key={index} value={cc}>
                {ca}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
