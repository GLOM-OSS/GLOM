import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { Major } from '@squoolr/api-services';
import { CreditUnit, CreditUnitSubject } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function ActionBar({
  disabled,
  majors,
  setActiveMajor,
  activeMajor,
  activeSemester,
  setActiveSemester,
  creditUnits,
  activeCreditUnit,
  setActiveCreditUnit,
  subjects,
  activeSubject,
  setActiveSubject,
}: {
  disabled: boolean;
  majors: Major[];
  activeMajor?: Major;
  setActiveMajor: (major: Major | undefined) => void;
  activeSemester: number | undefined;
  setActiveSemester: (semester: number) => void;
  creditUnits: CreditUnit[];
  activeCreditUnit?: CreditUnit;
  setActiveCreditUnit: (creditUnit: CreditUnit | undefined) => void;
  subjects: CreditUnitSubject[];
  activeSubject?: CreditUnitSubject;
  setActiveSubject: (subject: CreditUnitSubject | undefined) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{marginTop: theme.spacing(1)}}>
      <FormControl>
        <InputLabel id="major">{formatMessage({ id: 'major' })}</InputLabel>
        <Select
          size="small"
          labelId="major"
          disabled={disabled}
          onChange={(event) => {
            setActiveSemester(Number(event.target.value));
          }}
          value={activeMajor?.major_code}
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
          {majors.map(({ major_code: mc, major_name: mn }, index) => (
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
            setActiveMajor(
              majors.find(({ major_code: mc }) => mc === event.target.value)
            );
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

      <FormControl>
        <InputLabel id="creditUnit">
          {formatMessage({ id: 'creditUnit' })}
        </InputLabel>
        <Select
          size="small"
          labelId="creditUnit"
          disabled={disabled}
          onChange={(event) => {
            setActiveCreditUnit(
              creditUnits.find(
                ({ annual_credit_unit_id: acu_id }) =>
                  acu_id === event.target.value
              )
            );
          }}
          value={activeCreditUnit?.annual_credit_unit_id}
          input={
            <OutlinedInput
              sx={{ minWidth: theme.spacing(20) }}
              label={formatMessage({ id: 'creditUnit' })}
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
          {creditUnits.map(
            ({ annual_credit_unit_id, credit_unit_name }, index) => (
              <MenuItem key={index} value={annual_credit_unit_id}>
                {credit_unit_name}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="subject">{formatMessage({ id: 'subject' })}</InputLabel>
        <Select
          size="small"
          labelId="subject"
          disabled={disabled}
          onChange={(event) => {
            setActiveSubject(
              subjects.find(
                ({ annual_credit_unit_subject_id: acus_id }) =>
                  acus_id === event.target.value
              )
            );
          }}
          value={activeSubject?.annual_credit_unit_subject_id}
          input={
            <OutlinedInput
              sx={{ minWidth: theme.spacing(20) }}
              label={formatMessage({ id: 'subject' })}
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
          {subjects.map(
            ({ annual_credit_unit_subject_id, subject_title }, index) => (
              <MenuItem key={index} value={annual_credit_unit_subject_id}>
                {subject_title}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
