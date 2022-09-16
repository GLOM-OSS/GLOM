import { Box, Button, Chip, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { AcademicYearInterface } from '../lib/selectAcademicYear';

export default function AcademicYear({
  academicYear: {
    academic_year_id,
    code,
    starting_date: startingDate,
    end_date: endDate,
    year_status: yearStatus,
  },
  handleSelectAcademicYear,
  selectedAcademicYearId,
}: {
  academicYear: AcademicYearInterface;
  handleSelectAcademicYear: (academic_year_id: string) => void;
  selectedAcademicYearId: string;
}) {
  const intl = useIntl()
  const {formatMessage, formatDate} = intl

  return (
    <Box
      component={Button}
      onClick={() =>
        selectedAcademicYearId !=='' ? null : handleSelectAcademicYear(academic_year_id)
      }
      fullWidth
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
        display: 'grid',
        alignItems: 'center',
        columnGap: theme.spacing(10),
        gridTemplateColumns: '155px 1fr 1fr 12ch',
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(3),
        color: theme.common.titleActive,
        justifyItems: 'start',
        backgroundColor: selectedAcademicYearId === academic_year_id
          ? lighten(theme.palette.secondary.main, 0.9)
          : 'initial',
      }}
    >
      <Typography>{code}</Typography>
      <Typography>
        {formatDate(new Date(startingDate), {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })}
      </Typography>
      <Typography>
        {formatDate(new Date(endDate), {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })}
      </Typography>
      <Chip
        sx={{
          justifySelf: 'center',
          backgroundColor: lighten(
            theme.palette[
              yearStatus === 'finished'
                ? 'error'
                : yearStatus === 'inactive'
                ? 'primary'
                : 'success'
            ].main,
            0.6
          ),
        }}
        label={formatMessage({ id: yearStatus })}
      />
    </Box>
  );
}
